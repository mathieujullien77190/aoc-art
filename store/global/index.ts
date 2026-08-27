import { create } from "zustand"

/** les valeurs du bureau, sans les fonctions qui les changent */
type Values = {
	lang: string
	animation: boolean
	keyboardOnFocus: boolean
	/** relance de la visite guidee, demandee par la commande tuto */
	tutorial: boolean
	/**
	 * Instant du dernier `flowers`, 0 tant qu'il n'a jamais tourne. Une
	 * date plutot qu'un booleen : rejouer la commande change la valeur,
	 * donc replante, ce qu'un true deja pose ne ferait pas.
	 */
	flowers: number
	/** meme principe pour stux : l'instant du dernier lancement */
	virus: number
	/** fenetres ouvertes du bureau ; la derniere est au premier plan */
	windows: string[]
}

type Global = Values & {
	setProperty: <K extends keyof Values>(key: K, value: Values[K]) => void
	focusWindow: (name: string) => void
	closeWindow: (name: string) => void
}

export const useGlobalStore = create<Global>(set => ({
	lang: "fr",
	animation: true,
	keyboardOnFocus: true,
	tutorial: false,
	flowers: 0,
	virus: 0,
	windows: ["shell"],

	setProperty: (key, value) => set({ [key]: value } as Partial<Values>),

	/**
	 * Ouvre la fenetre, ou la remonte si elle etait dessous. Le bureau
	 * vit dans le store pour qu'une commande du shell puisse l'ouvrir.
	 */
	focusWindow: name =>
		set(state => ({
			windows: [...state.windows.filter(item => item !== name), name],
		})),

	closeWindow: name =>
		set(state => ({ windows: state.windows.filter(item => item !== name) })),
}))

/**
 * Les selecteurs. Ils ne renvoient qu'une valeur deja dans le store, donc
 * la reference est stable et le composant ne se rend que si elle change.
 */
export const useGetLanguage = () => useGlobalStore(state => state.lang)

export const useGetAnimation = () => useGlobalStore(state => state.animation)

export const useGetKeyboardOnFocus = () =>
	useGlobalStore(state => state.keyboardOnFocus)

export const useGetTutorial = () => useGlobalStore(state => state.tutorial)

export const useGetFlowers = () => useGlobalStore(state => state.flowers)

export const useGetVirus = () => useGlobalStore(state => state.virus)

export const useGetWindows = () => useGlobalStore(state => state.windows)

/**
 * Hors composant : une commande n'est pas un rendu React, elle attaque le
 * store directement.
 */
export const globalActions = () => useGlobalStore.getState()
