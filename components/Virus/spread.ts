import { DOWN_BIAS } from "./constants"

/**
 * The melt: a single start point at the top of the window, and each cell
 * lost afterwards touches the already open ones, so the hole spreads as one
 * block instead of speckling the window.
 *
 * The frontier is the list of neighbouring cells still full. Picking at
 * random gives an irregular edge rather than a clean circle. Duplicates
 * stay in and are skipped when drawing: removing them would cost a search
 * per neighbour.
 */
export const createSpread = (cols: number, rows: number) => {
	const taken = new Set<number>()

	// start on the first row, at a random column: the melt enters the window
	// from the top
	const frontier: number[] = [Math.floor(Math.random() * cols)]

	const push = (cell: number) => {
		if (!taken.has(cell)) frontier.push(cell)
	}

	const spreadFrom = (cell: number) => {
		const x = cell % cols
		const y = Math.floor(cell / cols)

		if (x > 0) push(cell - 1)
		if (x < cols - 1) push(cell + 1)
		if (y > 0) push(cell - cols)

		// down more often: it drips instead of rounding off
		if (y < rows - 1) for (let i = 0; i < DOWN_BIAS; i++) push(cell + cols)
	}

	/** the next cell, or null when the whole window has melted */
	const next = (): number | null => {
		while (frontier.length > 0) {
			const index = Math.floor(Math.random() * frontier.length)
			const cell = frontier[index]

			frontier[index] = frontier[frontier.length - 1]
			frontier.pop()

			if (taken.has(cell)) continue

			taken.add(cell)
			spreadFrom(cell)
			return cell
		}

		return null
	}

	return { next }
}
