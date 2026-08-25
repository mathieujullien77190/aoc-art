/** @format */

import { ASCII_RAMP } from "../constants"
import { luminance } from "../helpers"

/** convertit un bloc de pixels en lignes de caracteres, selon la luminance */
export const toAscii = (
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
