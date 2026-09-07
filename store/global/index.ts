import { create } from "zustand"

import { BASE_LANG } from "_i18n"

/** ce que le bureau retient de la derniere commande jouee */
type LastCommand = {
	name: string
	/**
	 * Rang d'arrivee, strictement croissant. C'est lui qui distingue deux
	 * lancements de la meme commande : le nom seul ne bouge pas.
	 */
	seq: number
}

/** ce que le bureau garde en memoire, sans les fonctions qui le changent */
type Values = {
	/**
	 * Langue du bureau. Le shell tient la sienne, le paquet ne l'expose
	 * plus : la page la recopie ici a chaque commande lang jouee, et les
	 * ecrans du bureau la suivent.
	 */
	lang: string
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
	/** derniere commande jouee ; la visite guidee l'attend */
	lastCommand: LastCommand | null
}

type Global = Values & {
	setProperty: <K extends keyof Values>(key: K, value: Values[K]) => void
	focusWindow: (name: string) => void
	closeWindow: (name: string) => void
	/** note la commande qui vient de jouer, en avancant son rang */
	pushCommand: (name: string) => void
}

/**
 * L'etat du bureau. Celui du shell — animation, focus, historique — vit
 * dans le paquet flower-shell, qui n'a pas a connaitre les fenetres.
 */
export const useGlobalStore = create<Global>(set => ({
	lang: BASE_LANG,
	tutorial: false,
	flowers: 0,
	virus: 0,
	windows: ["shell"],
	lastCommand: null,

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

	pushCommand: name =>
		set(state => ({
			lastCommand: { name, seq: (state.lastCommand?.seq || 0) + 1 },
		})),
}))

export const useGetLang = () => useGlobalStore(state => state.lang)

export const useGetTutorial = () => useGlobalStore(state => state.tutorial)

export const useGetFlowers = () => useGlobalStore(state => state.flowers)

export const useGetVirus = () => useGlobalStore(state => state.virus)

export const useGetWindows = () => useGlobalStore(state => state.windows)

export const useGetLastCommand = () =>
	useGlobalStore(state => state.lastCommand)

/**
 * Hors composant : une commande n'est pas un rendu React, elle attaque le
 * store directement.
 */
export const globalActions = () => useGlobalStore.getState()
