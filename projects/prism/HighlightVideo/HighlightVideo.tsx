import { MouseEvent, useEffect, useRef } from "react"

import {
	HIGHLIGHT_BLOCK_COLS,
	HIGHLIGHT_CELL_COVERAGE,
	HIGHLIGHT_WIDTH,
	RENDER_FPS,
} from "../constants"
import {
	buildZoneMask,
	frameHeight,
	hexToRgb,
	hue,
	luminance,
	rgbToHex,
} from "../helpers"
import { matchesHue } from "./helpers"
import { HighlightVideoProps } from "./types"
import * as S from "./UI"

/**
 * Ne retient que les pixels dont la teinte est proche de `color`, le reste
 * passe en gris. Le tri se fait sur la teinte et non sur la distance RVB :
 * un rouge sombre et un rouge clair sont ainsi retenus tous les deux.
 *
 * `fill` decide du sort des zones retenues : elles gardent leur couleur, ou
 * sont recouvertes d'aplats opaques qui masquent la video.
 */
export const HighlightVideo = ({
	videoRef,
	color,
	tolerance,
	fill,
	zone,
	onPick = () => {},
}: HighlightVideoProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const video = videoRef.current
		const canvas = canvasRef.current
		if (!video || !canvas) return

		const width = HIGHLIGHT_WIDTH
		const height = frameHeight(width)
		canvas.width = width
		canvas.height = height

		const ctx = canvas.getContext("2d", { willReadFrequently: true })
		if (!ctx) return

		const [red, green, blue] = hexToRgb(color)
		const target = hue(red, green, blue)

		// calcule une fois par changement de zone, pas a chaque image
		const mask = buildZoneMask(zone, width, height)

		// grille de la mosaique : cellules carrees.
		// allouee une fois, pas a chaque image
		const cols = HIGHLIGHT_BLOCK_COLS
		const rows = Math.max(1, Math.round((cols * height) / width))
		const cellWidth = width / cols
		const cellHeight = height / rows
		const minPixels = cellWidth * cellHeight * HIGHLIGHT_CELL_COVERAGE
		const hits = new Uint32Array(cols * rows)

		// arrondis au pixel superieur : les aplats se chevauchent legerement,
		// ce qui evite les lisieres claires dues a l'antialiasing
		const boxWidth = Math.ceil(cellWidth)
		const boxHeight = Math.ceil(cellHeight)

		let frame = 0
		let last = 0
		const interval = 1000 / RENDER_FPS

		const draw = (now: number) => {
			frame = window.requestAnimationFrame(draw)

			if (now - last < interval) return
			last = now
			// HAVE_CURRENT_DATA : rien a lire avant
			if (video.readyState < 2) return

			ctx.drawImage(video, 0, 0, width, height)

			let image: ImageData
			try {
				image = ctx.getImageData(0, 0, width, height)
			} catch {
				// canvas teinte : la source ne renvoie pas d'en-tete CORS
				window.cancelAnimationFrame(frame)
				return
			}

			const asBlocks = fill === "blocks"
			if (asBlocks) hits.fill(0)

			const { data } = image
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const i = (y * width + x) * 4
					const r = data[i]
					const g = data[i + 1]
					const b = data[i + 2]

					const keep =
						(!mask || mask[y * width + x] === 1) &&
						matchesHue(r, g, b, target, tolerance)

					if (keep && asBlocks) {
						hits[
							Math.floor(y / cellHeight) * cols + Math.floor(x / cellWidth)
						]++
					}

					// en mosaique tout passe en gris : les aplats masquent la zone
					if (!keep || asBlocks) {
						const gray = luminance(r, g, b)
						data[i] = gray
						data[i + 1] = gray
						data[i + 2] = gray
					}
				}
			}

			ctx.putImageData(image, 0, 0)

			if (!asBlocks) return

			ctx.fillStyle = color
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					if (hits[row * cols + col] < minPixels) continue
					ctx.fillRect(col * cellWidth, row * cellHeight, boxWidth, boxHeight)
				}
			}
		}

		frame = window.requestAnimationFrame(draw)

		return () => window.cancelAnimationFrame(frame)
	}, [videoRef, color, tolerance, fill, zone])

	/**
	 * Pipette. On echantillonne la video brute et non le canvas affiche :
	 * celui-ci est deja passe en gris, on n'y lirait que du gris.
	 */
	const handlePick = (event: MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current
		const video = videoRef.current
		if (!canvas || !video || video.readyState < 2) return

		const rect = canvas.getBoundingClientRect()
		if (!rect.width || !rect.height) return

		// le cadre et le canvas sont tous deux en 16/9 : pas de recadrage,
		// un simple rapport suffit
		const x = Math.floor(
			((event.clientX - rect.left) / rect.width) * canvas.width
		)
		const y = Math.floor(
			((event.clientY - rect.top) / rect.height) * canvas.height
		)

		const sampler = document.createElement("canvas")
		sampler.width = canvas.width
		sampler.height = canvas.height
		const samplerCtx = sampler.getContext("2d", { willReadFrequently: true })
		if (!samplerCtx) return

		samplerCtx.drawImage(video, 0, 0, sampler.width, sampler.height)

		try {
			const { data } = samplerCtx.getImageData(x, y, 1, 1)
			onPick(rgbToHex(data[0], data[1], data[2]))
		} catch {
			// canvas teinte : rien a echantillonner
		}
	}

	return <S.Canvas ref={canvasRef} onClick={handlePick} />
}
