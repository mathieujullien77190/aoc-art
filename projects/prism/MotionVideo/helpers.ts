type MotionBoxesInput = {
	/** 1 si la cellule bouge */
	moving: Uint8Array
	/** tampons reutilises entre les images, pour eviter d'allouer */
	seen: Uint8Array
	stack: Int32Array
	cols: number
	rows: number
	minCells: number
	cellWidth: number
	cellHeight: number
}

/**
 * Regroupe les cellules actives contigues (voisinage a 4) par remplissage,
 * et renvoie le cadre englobant de chaque groupe assez grand, en pixels.
 */
export const findMotionBoxes = ({
	moving,
	seen,
	stack,
	cols,
	rows,
	minCells,
	cellWidth,
	cellHeight,
}: MotionBoxesInput): number[][] => {
	const cellCount = cols * rows
	const boxes: number[][] = []
	seen.fill(0)

	for (let start = 0; start < cellCount; start++) {
		if (!moving[start] || seen[start]) continue

		let top = 0
		stack[top++] = start
		seen[start] = 1

		const push = (neighbour: number) => {
			if (!moving[neighbour] || seen[neighbour]) return
			seen[neighbour] = 1
			stack[top++] = neighbour
		}

		let count = 0
		let minCol = cols
		let maxCol = 0
		let minRow = rows
		let maxRow = 0

		while (top > 0) {
			const cell = stack[--top]
			const col = cell % cols
			const row = (cell - col) / cols

			count++
			if (col < minCol) minCol = col
			if (col > maxCol) maxCol = col
			if (row < minRow) minRow = row
			if (row > maxRow) maxRow = row

			if (col > 0) push(cell - 1)
			if (col < cols - 1) push(cell + 1)
			if (row > 0) push(cell - cols)
			if (row < rows - 1) push(cell + cols)
		}

		if (count < minCells) continue

		boxes.push([
			minCol * cellWidth,
			minRow * cellHeight,
			(maxCol - minCol + 1) * cellWidth,
			(maxRow - minRow + 1) * cellHeight,
		])
	}

	return boxes
}
