import { Pos } from "./types"

/**
 * Corrects the offset to bring the window back into the desktop: one
 * dropped half outside keeps its title bar out of reach and cannot be
 * grabbed again.
 */
export const clampDrag = (drag: Pos, box: DOMRect, area: DOMRect): Pos => {
	const out = (before: number, after: number) =>
		Math.max(0, before) - Math.max(0, after)

	return {
		x: drag.x + out(area.left - box.left, box.right - area.right),
		y: drag.y + out(area.top - box.top, box.bottom - area.bottom),
	}
}
