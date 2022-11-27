/** @format */

import { RootState } from "../root"
import { useAppSelector } from "_store/hooks"

export const useGetCommands = () =>
	useAppSelector((state: RootState) =>
		[
			...state.history.commands.filter(command => command.visible),
			...state.history.restrictedCommands.filter(command => command.visible),
		].sort((a, b) => a.timestamp - b.timestamp)
	)

export const useGetCursor = () =>
	useAppSelector((state: RootState) => state.history.cursor)

export const useGetCurrentCommand = () =>
	useAppSelector(
		(state: RootState) => state.history.commands[state.history.cursor] || null
	)

export const useGetStart = () =>
	useAppSelector((state: RootState) => {
		const restrictedCmds = state.history.restrictedCommands.map(
			cmd => cmd.isRendered
		)
		const baseCmds = state.history.commands

		if (
			restrictedCmds.length === 2 &&
			restrictedCmds[0] &&
			restrictedCmds[1] &&
			baseCmds.length === 0
		) {
			return true
		}
		return false
	})
