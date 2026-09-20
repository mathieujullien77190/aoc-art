import { create } from "zustand"

import { BASE_LANG } from "_i18n"

/** what the desktop keeps in memory, minus the functions that change it */
type Values = {
	/**
	 * Desktop language. The shell keeps its own; the page copies it here on
	 * each `lang` command, and desktop screens follow it.
	 */
	lang: string
	/**
	 * Time of the last `flowers`, 0 if never run. A date rather than a boolean:
	 * replaying the command changes the value, hence re-plants.
	 */
	flowers: number
	/** same idea for stux: time of the last launch */
	virus: number
	/** open desktop windows; the last one is in front */
	windows: string[]
}

type Global = Values & {
	setProperty: <K extends keyof Values>(key: K, value: Values[K]) => void
	focusWindow: (name: string) => void
	closeWindow: (name: string) => void
}

/**
 * The desktop state. The shell's (animation, focus, history) lives in the
 * flower-shell package, which knows nothing of windows.
 */
export const useGlobalStore = create<Global>(set => ({
	lang: BASE_LANG,
	flowers: 0,
	virus: 0,
	windows: ["shell"],

	setProperty: (key, value) => set({ [key]: value } as Partial<Values>),

	/** Opens the window, or raises it if it was below. */
	focusWindow: name =>
		set(state => ({
			windows: [...state.windows.filter(item => item !== name), name],
		})),

	closeWindow: name =>
		set(state => ({ windows: state.windows.filter(item => item !== name) })),
}))

export const useGetLang = () => useGlobalStore(state => state.lang)

export const useGetFlowers = () => useGlobalStore(state => state.flowers)

export const useGetVirus = () => useGlobalStore(state => state.virus)

export const useGetWindows = () => useGlobalStore(state => state.windows)

/** Outside components: a command is not a React render, it uses the store directly. */
export const globalActions = () => useGlobalStore.getState()
