/** @format */
import { BaseCommand, Command, Args } from "_/types"

const isAuthorizeArgs = (args: string[], testArgs: Args) => {
	const test1 =
		args.filter(item => testArgs.authorize.includes(item)).length ===
		args.length

	const test2 =
		(args.length === 0 && testArgs.empty === true) || args.length > 0

	return test1 && test2
}

type CreateCommandProps = {
	commands: BaseCommand[]
	commandPattern: string
	restricted: boolean
}

export const createCommand = ({
	commands,
	commandPattern,
	restricted = false,
}: CreateCommandProps): Command => {
	const timestamp = new Date().getTime()
	const split = commandPattern.split(" ")
	const name = split[0]
	const args = split.slice(1)

	const select = findCommand({ commands, name, restricted })

	if (select) {
		const okArgs = !select.testArgs || isAuthorizeArgs(args, select.testArgs)

		if (okArgs) {
			return {
				restricted,
				name,
				args,
				result: executeCommand({ commands, command: select, args }),
				pattern: commandPattern,
				timestamp,
				id: `${timestamp}-${name}`,
				isRendered: false,
				canExecute: true,
			}
		} else {
			const error = findCommand({
				commands,
				name: "argumenterror",
				restricted: true,
			})
			return {
				restricted,
				pattern: commandPattern,
				name,
				args,
				result: executeCommand({ commands, command: error, args: [name] }),
				timestamp,
				id: `${timestamp}-${name}`,
				isRendered: false,
				canExecute: false,
			}
		}
	} else {
		const error = findCommand({ commands, name: "unknow", restricted: true })
		return {
			restricted,
			pattern: commandPattern,
			name,
			args,
			result: executeCommand({ commands, command: error, args: [name] }),
			timestamp,
			id: `${timestamp}-${name}`,
			isRendered: false,
			canExecute: false,
		}
	}
}

type ExecuteCommandProps = {
	commands: BaseCommand[]
	command: BaseCommand
	args: Command["args"]
}

export const executeCommand = ({
	commands,
	command,
	args,
}: ExecuteCommandProps): string => {
	return command.action({
		commands,
		name: command.name,
		args,
		help: command.help,
	})
}

type FindCommandProps = {
	commands: BaseCommand[]
	name: string
	restricted: boolean
}

export const findCommand = ({
	commands,
	name,
	restricted = false,
}: FindCommandProps): BaseCommand | null => {
	return (
		commands.filter(
			command =>
				command.name === name &&
				(command.restricted === restricted || restricted === null)
		)[0] || null
	)
}

type AutocompleteCommandProps = {
	commands: BaseCommand[]
	startCommand: string
}

export const autocompleteCommand = ({
	commands,
	startCommand,
}: AutocompleteCommandProps): string => {
	if (startCommand === "") return ""

	const find = commands.filter(
		command => !command.restricted && command.name.indexOf(startCommand) === 0
	)
	if ((find[0]?.name || "").length === startCommand.length) return ""
	return find[0]?.name || ""
}
