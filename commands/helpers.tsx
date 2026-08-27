import { commands as baseCommands } from "_commands/commands"
import { createCommand, findCommand } from "_commands/terminalEngine"

import { historyActions } from "_store/history/"

/**
 * Joue une commande : son effet de bord d'abord, puis son ajout a
 * l'historique. Le store zustand s'attaque hors composant, il n'y a donc
 * plus de dispatch a promener.
 */
const send = (commandPattern: string, restricted: boolean) => {
	const cmd = createCommand({
		commands: baseCommands,
		commandPattern,
		restricted,
	})
	const baseCmd = findCommand({
		commands: baseCommands,
		name: cmd.name,
		restricted,
	})

	if (baseCmd?.effect && cmd.canExecute) baseCmd.effect({ args: cmd.args })

	// effacer l'ecran laisse le titre et l'accueil, comme au demarrage
	if (!restricted && cmd.name === "clear" && cmd.canExecute) {
		sendRestrictedCommand("title")
		sendRestrictedCommand("welcome")
	}

	historyActions().addCommand(cmd)
}

export const sendRestrictedCommand = (commandPattern: string) =>
	send(commandPattern, true)

export const sendCommand = (commandPattern: string) =>
	send(commandPattern, false)
