import { RefObject, useEffect } from "react"

import { PER_TICK, PIXEL_SIZE, TICK_MS } from "./constants"
import { createReveal } from "./reveal"
import { createSpread } from "./spread"

/**
 * Pilote le canvas : contamination, clic qui nettoie, apparition du mot.
 *
 * Tout vit hors de React — le rendu n'a rien a redessiner, seul le canvas
 * change — d'ou un unique effet monte une fois pour toutes.
 */
export const useVirus = (canvasRef: RefObject<HTMLCanvasElement>) => {
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		// la resolution est figee au montage : redimensionner en cours de
		// route effacerait ce qui est deja pose
		const width = window.innerWidth
		const height = window.innerHeight
		canvas.width = width
		canvas.height = height

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const spread = createSpread(
			ctx,
			Math.ceil(width / PIXEL_SIZE),
			Math.ceil(height / PIXEL_SIZE)
		)
		const reveal = createReveal(ctx, width, height)

		// une fois le mot lance, plus rien ne se nettoie : le clic ne doit pas
		// permettre d'effacer REFRESH
		let locked = false

		// ecoute sur window : le canvas est en pointer-events none pour ne pas
		// avaler les clics du terminal en dessous
		const onClick = (event: MouseEvent) => {
			if (locked) return
			spread.blast(event.clientX, event.clientY)
		}
		window.addEventListener("click", onClick)

		let frame = 0
		let last = 0

		const draw = (now: number) => {
			if (now - last >= TICK_MS) {
				last = now
				for (let n = 0; n < PER_TICK && !spread.isFull(); n++) spread.step()
			}

			if (reveal.update(now, spread.isFull())) locked = true

			frame = window.requestAnimationFrame(draw)
		}

		frame = window.requestAnimationFrame(draw)

		return () => {
			window.cancelAnimationFrame(frame)
			window.removeEventListener("click", onClick)
		}
	}, [canvasRef])
}
