import { createSlice } from "@reduxjs/toolkit"

type Global = {
	lang: string
	animation: boolean
	keyboardOnFocus: boolean
	/** relance de la visite guidee, demandee par la commande tutorial */
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

const initialState: Global = {
	lang: "fr",
	animation: true,
	keyboardOnFocus: true,
	tutorial: false,
	flowers: 0,
	virus: 0,
	windows: ["shell"],
}

const folderSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setProperties<T>(state, action: { payload: { key: string; value: T } }) {
			state[action.payload.key] = action.payload.value
		},

		/**
		 * Ouvre la fenetre, ou la remonte si elle etait dessous. Le bureau
		 * vit dans le store pour qu'une commande du shell puisse l'ouvrir.
		 */
		focusWindow(state, action: { payload: string }) {
			state.windows = [
				...state.windows.filter(name => name !== action.payload),
				action.payload,
			]
		},

		closeWindow(state, action: { payload: string }) {
			state.windows = state.windows.filter(name => name !== action.payload)
		},
	},
})

const { setProperties, focusWindow, closeWindow } = folderSlice.actions

const { reducer } = folderSlice

export { setProperties, focusWindow, closeWindow, reducer }
