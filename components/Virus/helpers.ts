import { PIXEL_SIZE } from "./constants"
import { Rect } from "./types"

/** position du cadre vise, ou null s'il n'est pas a l'ecran */
export const readRect = (selector: string): Rect | null => {
	const node = document.querySelector(selector)
	if (!node) return null

	const box = node.getBoundingClientRect()
	if (box.width === 0 || box.height === 0) return null

	return { top: box.top, left: box.left, width: box.width, height: box.height }
}

/**
 * Le masque : blanc partout au depart, donc la fenetre est entiere. Vider
 * une case la rend transparente, et c'est le bureau qui apparait dessous.
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

/** troue le masque : la case perd son alpha, la fenetre s'ouvre dessus */
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
 * Pose le masque sur la fenetre. Le canvas repasse par une image, seule
 * forme que CSS accepte ; l'alpha du masque decide de ce qui reste.
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

/** rend la fenetre intacte : le masque s'en va, les trous avec */
export const clearMask = (target: HTMLElement) => {
	const style = target.style as MaskStyle

	style.maskImage = ""
	style.webkitMaskImage = ""
	style.maskSize = ""
	style.webkitMaskSize = ""
	style.maskRepeat = ""
}
