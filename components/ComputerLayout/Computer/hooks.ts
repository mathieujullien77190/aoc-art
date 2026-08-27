import { useSyncExternalStore } from "react"

// rien a surveiller : le montage n'arrive qu'une fois
const subscribe = () => () => {}

/**
 * Faux au prerendu et pendant l'hydratation, vrai ensuite. Passe par
 * useSyncExternalStore plutot qu'un useEffect + setState : React sait deja
 * basculer du snapshot serveur au snapshot client une fois l'arbre hydrate.
 */
export const useIsMounted = (): boolean =>
	useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	)
