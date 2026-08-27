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
 * La fenetre du shell fond a partir d'un point pris en haut : une case de
 * vingt par vingt disparait de temps en temps, et les suivantes sont
 * prises collees au trou deja ouvert. Une fois la derniere case avalee,
 * onDead previent le poste, qui part en ecran bleu.
 *
 * Le trou est un vrai trou : un masque CSS pose sur la fenetre elle-meme,
 * blanc au depart, vide case par case. Le bureau apparait dessous, et
 * comme le masque voyage avec l'element, deplacer la fenetre n'impose
 * aucun suivi.
 *
 * La taille est figee a la premiere mesure — redimensionner la fenetre
 * etirerait le masque, c'est laisse de cote pour l'instant.
 *
 * La graine vaut 0 tant que stux n'a pas tourne : rien ne se passe alors.
 */
export const useVirus = (seed: number, onDead: () => void) => {
	// la callback change a chaque rendu du bureau : la garder dans une ref
	// evite de relancer l'infection pour autant. La ref se met a jour dans
	// un effet, y toucher pendant le rendu n'est pas permis.
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

			// au plafond, pas au plancher : sinon le reste de la division
			// laisse une bande a droite et une en bas que rien ne ronge. La
			// derniere case deborde du canvas, ce qui ne coute rien.
			cols = Math.ceil(width / PIXEL_SIZE)
			mask = createMask(width, height)
			spread = createSpread(cols, Math.ceil(height / PIXEL_SIZE))
			target = document.querySelector(TARGET)

			return true
		}

		const tick = () => {
			// la fenetre peut ne pas etre encore la : on reessaie au prochain tour
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
			// la fenetre n'appartient pas au virus : on la rend intacte
			if (target) clearMask(target)
		}
		// la graine change a chaque stux : la fenetre repart entiere
	}, [seed])
}
