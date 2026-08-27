import { useCallback, useRef, useSyncExternalStore } from "react"

import { Rect } from "./types"
import { readRect, sameRect } from "./helpers"

/**
 * Position de la cible, relue a chaque frame : le shell ecrit lettre par
 * lettre, defile et se redimensionne, donc une ecoute du resize ne suffit
 * pas a la suivre.
 *
 * La mesure vit hors de React et n'est publiee que si le rectangle a
 * bouge : un setState par frame relancerait un rendu pour rien.
 */
export const useTargetRect = (
	target: string | null,
	fallback: string | null,
	active: boolean
): Rect | null => {
	const rect = useRef<Rect | null>(null)

	const subscribe = useCallback(
		(onChange: () => void) => {
			const measure = () =>
				readRect(target) || (fallback ? readRect(fallback) : null)

			rect.current = active && target ? measure() : null
			if (!active || !target) return () => {}

			let frame = 0

			const tick = () => {
				const next = measure()
				if (!sameRect(rect.current, next)) {
					rect.current = next
					onChange()
				}
				frame = window.requestAnimationFrame(tick)
			}

			frame = window.requestAnimationFrame(tick)

			return () => window.cancelAnimationFrame(frame)
		},
		[target, fallback, active]
	)

	return useSyncExternalStore(
		subscribe,
		() => rect.current,
		() => null
	)
}
