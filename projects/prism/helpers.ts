/** @format */

import { STREAM_BASE } from "./constants"

export const buildStreamUrl = (publicKey: string): string =>
	`${STREAM_BASE}?public=${encodeURIComponent(publicKey)}`

/** un glyphe monospace est ~2x plus haut que large : 16/9 puis moitie */
export const asciiRows = (cols: number): number =>
	Math.max(1, Math.round((cols * 9) / 16 / 2))

/** hauteur 16/9 pour une largeur donnee */
export const frameHeight = (width: number): number =>
	Math.max(1, Math.round((width * 9) / 16))

/** luminance perceptuelle : meme base que le filtre grayscale du navigateur */
export const luminance = (r: number, g: number, b: number): number =>
	0.299 * r + 0.587 * g + 0.114 * b

/** teinte en degres ; -1 si le pixel est achromatique */
export const hue = (r: number, g: number, b: number): number => {
	const max = Math.max(r, g, b)
	const delta = max - Math.min(r, g, b)
	if (delta === 0) return -1

	const raw =
		max === r
			? ((g - b) / delta) % 6
			: max === g
				? (b - r) / delta + 2
				: (r - g) / delta + 4

	return (raw * 60 + 360) % 360
}

/** saturation HSV : 0 = gris, 1 = couleur pure */
export const saturation = (r: number, g: number, b: number): number => {
	const max = Math.max(r, g, b)
	return max === 0 ? 0 : (max - Math.min(r, g, b)) / max
}

/** ecart entre deux teintes sur le cercle chromatique, en degres */
export const hueDistance = (a: number, b: number): number => {
	const delta = Math.abs(a - b) % 360
	return delta > 180 ? 360 - delta : delta
}

export const hexToRgb = (hex: string): [number, number, number] => {
	const value = hex.replace("#", "")
	return [
		parseInt(value.slice(0, 2), 16),
		parseInt(value.slice(2, 4), 16),
		parseInt(value.slice(4, 6), 16),
	]
}

export const rgbToHex = (r: number, g: number, b: number): string =>
	"#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")
