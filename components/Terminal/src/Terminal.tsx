/** @format */

import React from "react"

import { TerminalProps } from "./types"

import Input from "_components/Input"
import Command from "_components/Command"

import { commands as baseCommands } from "_commands/commands"
import { findCommand } from "_commands/terminalEngine"

import * as S from "./UI"

export const Terminal = ({
	commands,
	currentCommand,
	options,
	onRendered,
	onAnimateCommand,
	onSendCommand,
	onSendRestrictedCommand,
	onSendPreviousCommand,
	onSendNextCommand,
}: TerminalProps) => {
	const [forceFocus, setForceFocus] = useState<number>(0)

	return (
		<S.TerminalContainer onClick={() => setForceFocus(prev => prev + 1)}>
			{commands
				.filter(command => command.visible)
				.map((command, i, all) => {
					const prevIsRendered = i === 0 ? true : all[i - 1].isRendered
					const baseCommand = findCommand({
						commands: baseCommands,
						name: command.name,
						restricted: command.restricted,
					})

					return (
						<Command
							lang={options.lang}
							animation={options.animation}
							command={command}
							baseCommand={baseCommand}
							key={command.id}
							canRendered={prevIsRendered}
							onRendered={() => onRendered(command.id)}
							onAnimate={onAnimateCommand}
							onClickCommand={(name, args) =>
								onSendRestrictedCommand(`${name} ${args.join(" ")}`)
							}
						/>
					)
				})}

			<Input
				forceFocus={forceFocus}
				options={options}
				value={currentCommand?.pattern}
				onValidate={onSendCommand}
				onCallPrevious={onSendPreviousCommand}
				onCallNext={onSendNextCommand}
			/>
		</S.TerminalContainer>
	)
}
