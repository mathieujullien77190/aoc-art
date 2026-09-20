import { useEffect, useRef } from "react"

import { PIXEL_SIZE, TARGET, TICK_MS } from "./constants"
import {
	applyMask,
	clearMask,
	createMask,
	punchHole,
	readRect,
} from "./helpers"
import { createSpread } from "./spread"

/**
 * The shell window melts from a point at the top: a 20 by 20 cell vanishes
 * now and then, the next ones taken next to the hole already open. Once
 * the last cell is eaten, onDead tells the machine, which goes blue screen.
 *
 * The hole is a real hole: a CSS mask on the window itself, white at first,
 * emptied cell by cell. The desktop shows through, and as the mask travels
 * with the element, moving the window needs no tracking.
 *
 * Size is frozen at the first measure — resizing would stretch the mask,
 * left aside for now.
 *
 * The seed is 0 until stux has run: nothing happens then.
 */
export const useVirus = (seed: number, onDead: () => void) => {
	// the callback changes on every desktop render: keeping it in a ref avoids
	// restarting the infection. The ref updates in an effect, touching it
	// during render is not allowed.
	const dead = useRef(onDead)

	useEffect(() => {
		dead.current = onDead
	}, [onDead])

	useEffect(() => {
		if (!seed) return

		let target: HTMLElement | null = null
		let mask: ReturnType<typeof createMask> | null = null
		let spread: ReturnType<typeof createSpread> | null = null
		let cols = 0

		const setup = () => {
			const rect = readRect(TARGET)
			if (!rect) return false

			const width = Math.floor(rect.width)
			const height = Math.floor(rect.height)

			// ceiling, not floor: otherwise the division remainder leaves a strip on
			// the right and one at the bottom that nothing gnaws. The last cell
			// overflows the canvas, which costs nothing.
			cols = Math.ceil(width / PIXEL_SIZE)
			mask = createMask(width, height)
			spread = createSpread(cols, Math.ceil(height / PIXEL_SIZE))
			target = document.querySelector(TARGET)

			return true
		}

		const tick = () => {
			// the window may not be there yet: retry on the next turn
			if (!mask && !setup()) return
			if (!mask?.ctx || !target) return

			const cell = spread ? spread.next() : null

			if (cell === null) {
				window.clearInterval(timer)
				dead.current()
				return
			}

			punchHole(mask.ctx, cell, cols)
			applyMask(target, mask.canvas)
		}

		const timer = window.setInterval(tick, TICK_MS)

		return () => {
			window.clearInterval(timer)
			// the window does not belong to the virus: return it intact
			if (target) clearMask(target)
		}
		// the seed changes on each stux: the window starts whole again
	}, [seed])
}
