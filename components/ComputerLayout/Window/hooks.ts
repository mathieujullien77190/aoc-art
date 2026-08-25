/** @format */

import { useSyncExternalStore } from "react"

import { COMPACT_MAX_WIDTH } from "./constants"

const QUERY = `(max-width: ${COMPACT_MAX_WIDTH}px)`

const subscribe = (onChange: () => void) => {
	const query = window.matchMedia(QUERY)
	query.addEventListener("change", onChange)
	return () => query.removeEventListener("change", onChange)
}

/**
 * Vrai sous le seuil compact. Passe par useSyncExternalStore plutot qu'un
 * useEffect + setState : la valeur vit hors de React, et on evite un rendu
 * supplementaire au montage.
 */
export const useIsCompact = (): boolean =>
	useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false
	)
