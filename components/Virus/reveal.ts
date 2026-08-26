/** @format */

import {
	MESSAGE_DELAY_MS,
	MESSAGE_FADE_MS,
	MESSAGE_WIDTH_RATIO,
	MESSAGE_WORD,
	PIXEL_SIZE,
} from "./constants"
import { messageBlocks, smoothstep } from "./helpers"
import type { Block, Reveal } from "./types"

/** repeint les blocs du mot dans un gris qui va du noir au blanc */
const paint = (
	ctx: CanvasRenderingContext2D,
	blocks: Block[],
	progress: number
) => {
	const level = Math.round(smoothstep(progress) * 255)

	ctx.fillStyle = `rgb(${level}, ${level}, ${level})`
	for (const block of blocks)
		ctx.fillRect(block.x, block.y, block.size, block.size)
}

/**
 * Apparition du mot au centre, une fois l'ecran entierement couvert.
 *
 * Le compte a rebours repart de zero si l'ecran se rouvre : tant que la
 * contamination n'a pas fini, le mot n'a pas lieu d'etre.
 */
export const createReveal = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number
): Reveal => {
	const blocks = messageBlocks(
		MESSAGE_WORD,
		width,
		height,
		PIXEL_SIZE,
		MESSAGE_WIDTH_RATIO
	)

	// instant du noir complet, 0 tant que l'ecran ne l'est pas
	let covered = 0
	let done = false

	const update = (now: number, full: boolean) => {
		if (!full) {
			covered = 0
			done = false
			return false
		}

		if (!covered) covered = now

		const elapsed = now - covered - MESSAGE_DELAY_MS
		if (elapsed < 0) return false

		if (!done) {
			const progress = Math.min(1, elapsed / MESSAGE_FADE_MS)
			paint(ctx, blocks, progress)
			done = progress === 1
		}

		return true
	}

	return { update }
}
