import { PIXEL_SIZE } from "./constants"
import { Rect } from "./types"

/** position of the targeted frame, or null if off screen */
export const readRect = (selector: string): Rect | null => {
	const node = document.querySelector(selector)
	if (!node) return null

	const box = node.getBoundingClientRect()
	if (box.width === 0 || box.height === 0) return null

	return { top: box.top, left: box.left, width: box.width, height: box.height }
}

/**
 * The mask: white everywhere at first, so the window is whole. Emptying a
 * cell makes it transparent, and the desktop shows through.
 */
export const createMask = (width: number, height: number) => {
	const canvas = document.createElement("canvas")
	canvas.width = width
	canvas.height = height

	const ctx = canvas.getContext("2d")
	if (ctx) {
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(0, 0, width, height)
	}

	return { canvas, ctx }
}

/** punches the mask: the cell loses its alpha, the window opens onto it */
export const punchHole = (
	ctx: CanvasRenderingContext2D,
	cell: number,
	cols: number
) => {
	ctx.clearRect(
		(cell % cols) * PIXEL_SIZE,
		Math.floor(cell / cols) * PIXEL_SIZE,
		PIXEL_SIZE,
		PIXEL_SIZE
	)
}

type MaskStyle = CSSStyleDeclaration & {
	webkitMaskImage?: string
	webkitMaskSize?: string
}

/**
 * Applies the mask to the window. The canvas goes through an image, the
 * only form CSS accepts; the mask alpha decides what stays.
 */
export const applyMask = (target: HTMLElement, canvas: HTMLCanvasElement) => {
	const url = `url("${canvas.toDataURL()}")`
	const style = target.style as MaskStyle

	style.maskImage = url
	style.webkitMaskImage = url
	style.maskSize = "100% 100%"
	style.webkitMaskSize = "100% 100%"
	style.maskRepeat = "no-repeat"
}

/** makes the window intact: the mask goes away, holes with it */
export const clearMask = (target: HTMLElement) => {
	const style = target.style as MaskStyle

	style.maskImage = ""
	style.webkitMaskImage = ""
	style.maskSize = ""
	style.webkitMaskSize = ""
	style.maskRepeat = ""
}
