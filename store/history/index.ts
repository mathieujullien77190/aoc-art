import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"

import { Command } from "_/types"

type History = {
	commands: Command[]
	restrictedCommands: Command[]
	/** position dans l'historique, null quand on est sur la ligne vierge */
	cursor: number

	addCommand: (command: Command) => void
	setIsRendered: (id: string) => void
	clear: () => void
	moveCursor: (direction: number) => void
}

const rendered = (list: Command[], id: string) =>
	list.map(command =>
		command.id === id ? { ...command, isRendered: true } : command
	)

export const useHistoryStore = create<History>(set => ({
	commands: [],
	restrictedCommands: [],
	cursor: null,

	addCommand: command =>
		set(state =>
			command.restricted
				? {
						restrictedCommands: [
							...state.restrictedCommands,
							{ ...command, visible: true },
						],
						cursor: null,
				  }
				: {
						commands: [
							...state.commands,
							{ ...command, visible: command.name !== "clear" },
						],
						cursor: null,
				  }
		),

	setIsRendered: id =>
		set(state => ({
			commands: rendered(state.commands, id),
			restrictedCommands: rendered(state.restrictedCommands, id),
		})),

	clear: () =>
		set(state => ({
			commands: state.commands.map(command => ({
				...command,
				visible: false,
			})),
			restrictedCommands: state.restrictedCommands.map(command => ({
				...command,
				visible: false,
			})),
		})),

	moveCursor: direction =>
		set(state => {
			if (state.cursor === null) return { cursor: state.commands.length - 1 }
			if (direction < 0)
				return { cursor: state.cursor < 0 ? -1 : state.cursor + direction }
			if (direction > 0)
				return {
					cursor:
						state.cursor >= state.commands.length
							? state.commands.length
							: state.cursor + direction,
				}
			return {}
		}),
}))

/**
 * Les deux listes remises dans l'ordre. Le tableau est reconstruit a chaque
 * appel, d'ou useShallow : sans lui, la nouvelle reference relancerait un
 * rendu a chaque changement du store, meme sans rapport.
 */
export const useGetCommands = () =>
	useHistoryStore(
		useShallow(state =>
			[
				...state.commands.filter(command => command.visible),
				...state.restrictedCommands.filter(command => command.visible),
			].sort((a, b) => a.timestamp - b.timestamp)
		)
	)

export const useGetCursor = () => useHistoryStore(state => state.cursor)

export const useGetCurrentCommand = () =>
	useHistoryStore(state => state.commands[state.cursor] || null)

/** le boot est fini : les deux commandes d'accueil sont rendues */
export const useGetStart = () =>
	useHistoryStore(state => {
		const done = state.restrictedCommands.map(command => command.isRendered)

		return done.length === 2 && done[0] && done[1] && state.commands.length === 0
	})

/** derniere commande jouee par le visiteur, les restreintes exclues */
export const useGetLastCommand = () =>
	useHistoryStore(state => state.commands[state.commands.length - 1] || null)

/** hors composant : les commandes attaquent le store directement */
export const historyActions = () => useHistoryStore.getState()
