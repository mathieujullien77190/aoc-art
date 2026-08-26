import { rand } from "_components/ComputerLayout/helpers/math"
import {
	BLAST_RADIUS,
	BLAST_SHAPE,
	NEW_ZONE_CHANCE,
	PIXEL_SIZE,
	SEED_ATTEMPTS,
	SHAPE_SAMPLES,
	SPREAD_COLOR,
} from "./constants"
import { blastShape, clamp, randomFreeCell, sampleShape } from "./helpers"
import type { Spread } from "./types"

/**
 * Contamination de la grille.
 *
 * On garde la liste des cellules libres adjacentes a du noir — la frontiere —
 * et on pioche dedans : les taches grossissent donc par leurs bords. Une
 * petite chance amorce un foyer ailleurs, qui grossit a son tour.
 */
export const createSpread = (
	ctx: CanvasRenderingContext2D,
	cols: number,
	rows: number
): Spread => {
	const total = cols * rows

	const filled = new Uint8Array(total)
	// evite qu'une meme cellule entre plusieurs fois dans la frontiere
	const queued = new Uint8Array(total)
	const frontier: number[] = []
	let placed = 0

	const shape = blastShape(SHAPE_SAMPLES, BLAST_SHAPE)
	// la boite doit couvrir le rayon maximal, lobes compris
	const reach = BLAST_RADIUS * (1 + BLAST_SHAPE)

	const push = (cell: number) => {
		if (filled[cell] || queued[cell]) return
		queued[cell] = 1
		frontier.push(cell)
	}

	const place = (cell: number) => {
		filled[cell] = 1
		placed++

		const col = cell % cols
		const row = (cell - col) / cols

		ctx.fillStyle = SPREAD_COLOR
		ctx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)

		// 4-voisinage : les cellules libres autour rejoignent la frontiere
		if (col > 0) push(cell - 1)
		if (col < cols - 1) push(cell + 1)
		if (row > 0) push(cell - cols)
		if (row < rows - 1) push(cell + cols)
	}

	const step = () => {
		const seeding = frontier.length === 0 || rand(1, 1000) <= NEW_ZONE_CHANCE

		if (seeding) {
			const cell = randomFreeCell(filled, SEED_ATTEMPTS)
			if (cell !== -1) {
				place(cell)
				return
			}
		}

		if (frontier.length === 0) return

		// tirage puis echange avec le dernier : retrait en temps constant
		const index = rand(0, frontier.length - 1)
		const cell = frontier[index]
		frontier[index] = frontier[frontier.length - 1]
		frontier.pop()

		if (!filled[cell]) place(cell)
	}

	/** rend a la frontiere les bords de la zone nettoyee */
	const reopen = (cleared: number[]) => {
		for (const cell of cleared) {
			const col = cell % cols
			const row = (cell - col) / cols
			const touches =
				(col > 0 && filled[cell - 1]) ||
				(col < cols - 1 && filled[cell + 1]) ||
				(row > 0 && filled[cell - cols]) ||
				(row < rows - 1 && filled[cell + cols])

			if (touches) push(cell)
		}
	}

	/** nettoie une large zone lobee autour du point vise */
	const blast = (x: number, y: number) => {
		const first = clamp(Math.floor((x - reach) / PIXEL_SIZE), cols)
		const lastCol = clamp(Math.ceil((x + reach) / PIXEL_SIZE), cols)
		const top = clamp(Math.floor((y - reach) / PIXEL_SIZE), rows)
		const bottom = clamp(Math.ceil((y + reach) / PIXEL_SIZE), rows)

		const cleared: number[] = []

		for (let row = top; row < bottom; row++) {
			for (let col = first; col < lastCol; col++) {
				const cell = row * cols + col
				if (!filled[cell]) continue

				const dx = col * PIXEL_SIZE + PIXEL_SIZE / 2 - x
				const dy = row * PIXEL_SIZE + PIXEL_SIZE / 2 - y
				const radius = BLAST_RADIUS * sampleShape(shape, Math.atan2(dy, dx))

				if (Math.sqrt(dx * dx + dy * dy) >= radius) continue

				filled[cell] = 0
				queued[cell] = 0
				placed--
				cleared.push(cell)

				ctx.clearRect(
					col * PIXEL_SIZE,
					row * PIXEL_SIZE,
					PIXEL_SIZE,
					PIXEL_SIZE
				)
			}
		}

		// sinon la contamination ne pourrait jamais reprendre la zone nettoyee
		reopen(cleared)
	}

	return { step, blast, isFull: () => placed >= total }
}
