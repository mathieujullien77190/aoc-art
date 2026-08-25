/** @format */

import { useEffect, useRef } from "react"

import { ASCII_RAMP, RENDER_FPS } from "../constants"
import { asciiRows, luminance } from "../helpers"
import { AsciiVideoProps } from "./types"
import * as S from "./UI"

const toAscii = (
	data: Uint8ClampedArray,
	cols: number,
	rows: number
): string => {
	const last = ASCII_RAMP.length - 1
	const lines: string[] = []

	for (let y = 0; y < rows; y++) {
		let line = ""
		for (let x = 0; x < cols; x++) {
			const i = (y * cols + x) * 4
			const lum = luminance(data[i], data[i + 1], data[i + 2])
			line += ASCII_RAMP[Math.round((lum / 255) * last)]
		}
		lines.push(line)
	}

	return lines.join("\n")
}

/** rend le flux en ascii, a partir de la luminance de chaque bloc */
export const AsciiVideo = ({ videoRef, cols }: AsciiVideoProps) => {
	const preRef = useRef<HTMLPreElement>(null)

	useEffect(() => {
		const video = videoRef.current
		const pre = preRef.current
		if (!video || !pre) return

		const rows = asciiRows(cols)
		const canvas = document.createElement("canvas")
		canvas.width = cols
		canvas.height = rows
		const ctx = canvas.getContext("2d", { willReadFrequently: true })
		if (!ctx) return

		let frame = 0
		let last = 0
		const interval = 1000 / RENDER_FPS

		const draw = (now: number) => {
			frame = window.requestAnimationFrame(draw)

			if (now - last < interval) return
			last = now
			// HAVE_CURRENT_DATA : rien a lire avant
			if (video.readyState < 2) return

			ctx.drawImage(video, 0, 0, cols, rows)

			try {
				const { data } = ctx.getImageData(0, 0, cols, rows)
				pre.textContent = toAscii(data, cols, rows)
			} catch {
				// canvas teinte : la source ne renvoie pas d'en-tete CORS
				pre.textContent = "stream not readable as ascii (CORS)"
				window.cancelAnimationFrame(frame)
			}
		}

		frame = window.requestAnimationFrame(draw)

		return () => window.cancelAnimationFrame(frame)
	}, [videoRef, cols])

	return <S.Ascii ref={preRef} $cols={cols} />
}
