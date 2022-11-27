/** @format */

import React from "react"

import { TerminalProps } from "./types"

import Input from "_components/Input"
import Command from "_components/Command"

import { findCommand } from "_commands/data"

import * as S from "./UI"

export const Terminal = ({
	commands,
	currentCommand,
	options,
	onRendered,
	onSendCommand,
	onSendRestrictedCommand,
	onSendPreviousCommand,
	onSendNextCommand,
}: TerminalProps) => {
	return (
		<S.TerminalContainer>
			{commands
				.filter(command => command.visible)
				.map((command, i, all) => {
					const prevIsRendered = i === 0 ? true : all[i - 1].isRendered
					const baseCommand = findCommand(command.name, command.restricted)

					return (
						<Command
							lang={options.lang}
							animation={options.animation}
							command={command}
							baseCommand={baseCommand}
							key={command.id}
							canRendered={prevIsRendered}
							onRendered={() => onRendered(command.id)}
							onClickCommand={(name, args) =>
								onSendRestrictedCommand(`${name} ${args.join(" ")}`)
							}
						/>
					)
				})}

			<Input
				value={currentCommand?.pattern}
				onValidate={onSendCommand}
				onCallPrevious={onSendPreviousCommand}
				onCallNext={onSendNextCommand}
			/>
		</S.TerminalContainer>
	)
}
