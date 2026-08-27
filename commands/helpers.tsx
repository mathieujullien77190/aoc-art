import { commands as baseCommands } from "_commands/commands"
import { createCommand, findCommand } from "_commands/terminalEngine"

import { AppDispatch } from "_store/initStore"
import { addCommand } from "_store/history/"

export const sendRestrictedCommand = (
	commandPattern: string,
	dispatch: AppDispatch
) => {
	const cmd = createCommand({
		commands: baseCommands,
		commandPattern,
		restricted: true,
	})
	const baseCmd = findCommand({
		commands: baseCommands,
		name: cmd.name,
		restricted: true,
	})

	if (baseCmd?.redux && cmd.canExecute) {
		const reduxRes = baseCmd.redux({ args: cmd.args })

		// une commande peut toucher plusieurs slices : clear vide l'historique
		// et arrache les plantes, d'ou la liste acceptee en plus de l'action
		const actions = Array.isArray(reduxRes) ? reduxRes : [reduxRes]
		actions.forEach(action => {
			if (action) dispatch(action)
		})
	}

	dispatch(
		addCommand(
			createCommand({
				commands: baseCommands,
				commandPattern,
				restricted: true,
			})
		)
	)
}

export const sendCommand = (
	commandPattern: string,
	dispatch: AppDispatch
) => {
	const cmd = createCommand({
		commands: baseCommands,
		commandPattern,
		restricted: false,
	})
	const baseCmd = findCommand({
		commands: baseCommands,
		name: cmd.name,
		restricted: false,
	})

	if (baseCmd?.redux && cmd.canExecute) {
		const reduxRes = baseCmd.redux({ args: cmd.args })

		// une commande peut toucher plusieurs slices : clear vide l'historique
		// et arrache les plantes, d'ou la liste acceptee en plus de l'action
		const actions = Array.isArray(reduxRes) ? reduxRes : [reduxRes]
		actions.forEach(action => {
			if (action) dispatch(action)
		})
	}

	if (cmd.name === "clear" && cmd.canExecute) {
		sendRestrictedCommand("title", dispatch)
		sendRestrictedCommand("welcome", dispatch)
	}

	dispatch(addCommand(cmd))
}
