import { RefObject, useEffect } from "react"

import { REBUILD_MS, RESIZE_THRESHOLD } from "./constants"
import {
	buildOptions,
	loadFlw,
	plantLeft,
	plantSize,
	viewport,
} from "./helpers"
import { FlwGlobal, FlwPlant, Side, Size } from "./types"

/**
 * Pilote un calque : une plante qui pousse depuis un coin bas de l'ecran
 * jusqu'en haut, puis s'arrete une fois mure. Dessin par la bibliotheque
 * de Platane, lancee par la commande flowers.
 *
 * Elle lit la taille du conteneur dans son style inline au moment de la
 * creation et pose ses canvas dedans : redimensionner la fenetre oblige
 * donc a replanter, d'ou l'attente avant de le faire.
 */
export const useFlowers = (
	containerRef: RefObject<HTMLDivElement>,
	side: Side,
	seed: number
) => {
	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		let stopped = false
		let plant: FlwPlant | null = null
		let planted: Size | null = null
		let timer = 0
		let unlisten = () => {}

		const destroy = () => {
			if (plant) plant._running = false
			plant = null
			container.replaceChildren()
		}

		const build = (flw: FlwGlobal) => {
			destroy()

			const screen = viewport()
			const size = plantSize(screen)

			// la lib lit ces deux valeurs dans le style inline, au parseInt
			container.style.width = `${size.width}px`
			container.style.height = `${size.height}px`
			container.style.left = `${plantLeft(screen, side)}px`

			plant = flw.LimitedFlower.create(
				container,
				buildOptions(flw, screen),
				true
			)
			planted = screen
		}

		loadFlw().then(flw => {
			if (!flw || stopped) return

			build(flw)

			const onResize = () => {
				const screen = viewport()

				// une barre d'adresse qui se replie ne justifie pas de replanter
				const moved =
					!planted ||
					Math.abs(screen.width - planted.width) > RESIZE_THRESHOLD ||
					Math.abs(screen.height - planted.height) > RESIZE_THRESHOLD

				if (!moved) return

				window.clearTimeout(timer)
				timer = window.setTimeout(() => {
					if (!stopped) build(flw)
				}, REBUILD_MS)
			}

			window.addEventListener("resize", onResize)

			unlisten = () => window.removeEventListener("resize", onResize)
		})

		return () => {
			stopped = true
			window.clearTimeout(timer)
			unlisten()
			destroy()
		}
		// la graine change a chaque flowers : on replante
	}, [containerRef, side, seed])
}
