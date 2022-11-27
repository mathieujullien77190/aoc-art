/** @format */
import { BaseCommand, Command, Args, Trad } from "_/types"

import { findCommand } from "./data"

const isAuthorizeArgs = (args: string[], testArgs: Args) => {
	const test1 =
		args.filter(item => testArgs.authorize.includes(item)).length ===
		args.length

	const test2 =
		(args.length === 0 && testArgs.empty === true) || args.length > 0

	return test1 && test2
}

export const createCommand = (
	commandPattern: string,
	restricted: boolean = false
): Command => {
	const timestamp = new Date().getTime()
	const split = commandPattern.split(" ")
	const name = split[0]
	const args = split.slice(1)

	const select = findCommand(name, restricted)

	if (select) {
		const okArgs = !select.testArgs || isAuthorizeArgs(args, select.testArgs)

		if (okArgs) {
			return {
				restricted,
				name,
				args,
				result: executeCommand(select, args),
				pattern: commandPattern,
				timestamp,
				id: `${timestamp}-${name}`,
				isRendered: false,
				canExecute: true,
			}
		} else {
			const error = findCommand("argumenterror", true)
			return {
				restricted,
				pattern: commandPattern,
				name,
				args,
				result: executeCommand(error, [name]),
				timestamp,
				id: `${timestamp}-${name}`,
				isRendered: false,
				canExecute: false,
			}
		}
	} else {
		const error = findCommand("unknow", true)
		return {
			restricted,
			pattern: commandPattern,
			name,
			args,
			result: executeCommand(error, [name]),
			timestamp,
			id: `${timestamp}-${name}`,
			isRendered: false,
			canExecute: false,
		}
	}
}

export const executeCommand = (
	command: BaseCommand,
	args: Command["args"]
): Trad | string => {
	return command.action({
		name: command.name,
		args,
		help: command.help,
	})
}
