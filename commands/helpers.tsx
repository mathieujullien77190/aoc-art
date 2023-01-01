/** @format */

import { commands as baseCommands } from "_commands/commands"
import { createCommand, findCommand } from "_commands/terminalEngine"

import { addCommand } from "_store/history/"

export const sendRestrictedCommand = (
	commandPattern: string,
	dispatch: any
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

	if (baseCmd?.redux && cmd.canExecute)
		dispatch(baseCmd.redux({ args: cmd.args }))

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

export const sendCommand = (commandPattern: string, dispatch: any) => {
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

	if (baseCmd?.redux && cmd.canExecute)
		dispatch(baseCmd.redux({ args: cmd.args }))

	if (cmd.name === "clear" && cmd.canExecute) {
		sendRestrictedCommand("title", dispatch)
		sendRestrictedCommand("welcome", dispatch)
	}

	dispatch(addCommand(cmd))
}
