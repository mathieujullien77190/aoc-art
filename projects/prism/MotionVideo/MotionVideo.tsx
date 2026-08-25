/** @format */

import { useEffect, useRef } from "react"

import {
	HIGHLIGHT_WIDTH,
	MOTION_COLOR,
	MOTION_COLS,
	MOTION_MIN_CELLS,
	MOTION_THRESHOLD,
	RENDER_FPS,
} from "../constants"
import { buildZoneMask, frameHeight, luminance } from "../helpers"
import { findMotionBoxes } from "./helpers"
import { MotionVideoProps } from "./types"
import * as S from "./UI"

/**
 * Detection de mouvement par difference entre images successives.
 *
 * L'image est decoupee en cellules ; on compare la luminance moyenne de
 * chaque cellule a celle de l'image precedente. Les cellules qui bougent
 * assez sont regroupees par contiguite, et chaque groupe donne un cadre.
 */
export const MotionVideo = ({ videoRef, zone }: MotionVideoProps) => {
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

		// grille d'analyse, allouee une fois
		const cols = MOTION_COLS
		const rows = Math.max(1, Math.round((cols * height) / width))
		const cellWidth = width / cols
		const cellHeight = height / rows
		const cellCount = cols * rows

		const current = new Float32Array(cellCount)
		const previous = new Float32Array(cellCount)
		const moving = new Uint8Array(cellCount)
		const seen = new Uint8Array(cellCount)
		const stack = new Int32Array(cellCount)
		let hasPrevious = false

		// calcule une fois par changement de zone, pas a chaque image
		const mask = buildZoneMask(zone, cols, rows)

		// la camera tourne moins vite que la boucle : sans ce garde, on
		// comparerait une image a elle-meme et l'ecart serait nul.
		// les cadres sont conserves entre deux images pour rester visibles.
		let lastVideoTime = -1
		let boxes: number[][] = []

		const strokeBoxes = () => {
			ctx.strokeStyle = MOTION_COLOR
			ctx.lineWidth = 2
			for (const [x, y, w, h] of boxes) ctx.strokeRect(x, y, w, h)
		}

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

			const fresh = video.currentTime !== lastVideoTime
			lastVideoTime = video.currentTime

			if (!fresh) {
				strokeBoxes()
				return
			}

			let image: ImageData
			try {
				image = ctx.getImageData(0, 0, width, height)
			} catch {
				// canvas teinte : la source ne renvoie pas d'en-tete CORS
				window.cancelAnimationFrame(frame)
				return
			}

			// luminance moyenne par cellule
			current.fill(0)
			const { data } = image
			for (let y = 0; y < height; y++) {
				const row = Math.floor(y / cellHeight) * cols
				for (let x = 0; x < width; x++) {
					const i = (y * width + x) * 4
					current[row + Math.floor(x / cellWidth)] += luminance(
						data[i],
						data[i + 1],
						data[i + 2]
					)
				}
			}
			const pixelsPerCell = (width * height) / cellCount
			for (let i = 0; i < cellCount; i++) current[i] /= pixelsPerCell

			if (hasPrevious) {
				for (let i = 0; i < cellCount; i++)
					moving[i] =
						(!mask || mask[i] === 1) &&
						Math.abs(current[i] - previous[i]) > MOTION_THRESHOLD
							? 1
							: 0

				// regroupement des cellules actives contigues, par remplissage
				boxes = findMotionBoxes({
					moving,
					seen,
					stack,
					cols,
					rows,
					minCells: MOTION_MIN_CELLS,
					cellWidth,
					cellHeight,
				})
			}

			previous.set(current)
			hasPrevious = true
			strokeBoxes()
		}

		frame = window.requestAnimationFrame(draw)

		return () => window.cancelAnimationFrame(frame)
	}, [videoRef, zone])

	return <S.Canvas ref={canvasRef} />
}
