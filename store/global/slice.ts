import { createSlice } from "@reduxjs/toolkit"

type Global = {
	lang: string
	animation: boolean
	keyboardOnFocus: boolean
	/** fenetres ouvertes du bureau ; la derniere est au premier plan */
	windows: string[]
}

const initialState: Global = {
	lang: "fr",
	animation: false,
	keyboardOnFocus: true,
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
