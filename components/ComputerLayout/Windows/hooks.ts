import { useSyncExternalStore } from "react"

import { COMPACT_MAX_WIDTH } from "./constants"

const QUERY = `(max-width: ${COMPACT_MAX_WIDTH}px)`

const subscribe = (onChange: () => void) => {
	const query = window.matchMedia(QUERY)
	query.addEventListener("change", onChange)
	return () => query.removeEventListener("change", onChange)
}

/**
 * True below the compact threshold: the desktop then asks windows to stay
 * full. The threshold is this site's decision, not the package's.
 *
 * Uses useSyncExternalStore rather than useEffect + setState: the value
 * lives outside React, and it saves an extra render on mount.
 */
export const useIsCompact = (): boolean =>
	useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false
	)
