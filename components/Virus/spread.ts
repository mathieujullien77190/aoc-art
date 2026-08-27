import { DOWN_BIAS } from "./constants"

/**
 * La fonte : un seul point de depart, en haut de la fenetre, et chaque
 * case perdue ensuite est collee a celles deja ouvertes. Le trou s'etend
 * donc d'un bloc au lieu de miter la fenetre au hasard.
 *
 * La frontiere est la liste des cases voisines encore pleines. On y pioche
 * au hasard, ce qui donne un bord irregulier plutot qu'un cercle net. Les
 * doublons sont laisses dedans et ignores au tirage : les retirer couterait
 * une recherche a chaque voisin.
 */
export const createSpread = (cols: number, rows: number) => {
	const taken = new Set<number>()

	// depart sur la premiere rangee, a une colonne tiree au hasard : la
	// fonte entame donc la fenetre par le haut
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

		// vers le bas plus souvent : ca coule au lieu de s'arrondir
		if (y < rows - 1) for (let i = 0; i < DOWN_BIAS; i++) push(cell + cols)
	}

	/** la case suivante, ou null quand toute la fenetre a fondu */
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
