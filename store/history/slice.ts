/** @format */

import { createSlice } from "@reduxjs/toolkit"
import { Command } from "_/types"

type History = {
	commands: Command[]
	restrictedCommands: Command[]
	cursor: number
}

const initialState: History = {
	commands: [],
	restrictedCommands: [],
	cursor: null,
}

const folderSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		addCommand(state, action: { payload: Command }) {
			if (!action.payload.restricted) {
				state.commands = [
					...state.commands,
					{
						...action.payload,
						visible: action.payload.name === "clear" ? false : true,
					},
				]
			} else {
				state.restrictedCommands = [
					...state.restrictedCommands,
					{ ...action.payload, visible: true },
				]
			}
			state.cursor = null
		},
		setIsRendered(state, action: { payload: string }) {
			state.commands = state.commands.map(command =>
				command.id === action.payload
					? { ...command, isRendered: true }
					: command
			)
			state.restrictedCommands = state.restrictedCommands.map(command =>
				command.id === action.payload
					? { ...command, isRendered: true }
					: command
			)
		},
		clear(state) {
			state.commands = state.commands.map(command => ({
				...command,
				visible: false,
			}))
			state.restrictedCommands = state.restrictedCommands.map(command => ({
				...command,
				visible: false,
			}))
		},
		moveCursor(state, action: { payload: number }) {
			if (state.cursor === null) state.cursor = state.commands.length - 1
			else if (action.payload < 0)
				state.cursor = state.cursor < 0 ? -1 : state.cursor + action.payload
			else if (action.payload > 0)
				state.cursor =
					state.cursor >= state.commands.length
						? state.commands.length
						: state.cursor + action.payload
		},
	},
})

const { addCommand, moveCursor, clear, setIsRendered } = folderSlice.actions

const { reducer } = folderSlice

export { clear, addCommand, moveCursor, setIsRendered, reducer }
