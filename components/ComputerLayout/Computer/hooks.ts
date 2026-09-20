import { useSyncExternalStore } from "react"

// nothing to watch: mount only happens once
const subscribe = () => () => {}

/**
 * False during prerender and hydration, true after. Uses
 * useSyncExternalStore rather than useEffect + setState: React already
 * switches from the server snapshot to the client one once hydrated.
 */
export const useIsMounted = (): boolean =>
	useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	)
