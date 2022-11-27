/** @format */

import React, { useEffect } from "react"
import { CommandProps } from "./types"

import { app } from "_components/constants"

import * as S from "./UI"
import { trad, highlight } from "./helpers"
import { useDisplayByLetter } from "./hooks"

const Command = ({
	canRendered,
	command,
	baseCommand,
	lang,
	animation,
	onRendered = () => {},
	onClickCommand = () => {},
}: CommandProps) => {
	const result =
		baseCommand?.display?.trad === false
			? command.result
			: trad(command.result, lang)
	const name = trad(command.name, lang)
	const args = trad(command.args.map(arg => `${arg}`).join(" "), lang)

	const displayResult = useDisplayByLetter({
		baseTxt: result,
		canRendered,
		animation,
		lang,
		reverse: baseCommand?.display?.reverse,
		stepTime: baseCommand?.display?.stepTime,
		stepSize: baseCommand?.display?.stepSize,
	})

	useEffect(() => {
		window.scrollTo(0, 100000)
	}, [displayResult])

	useEffect(() => {
		if (displayResult.finish) onRendered()
	}, [displayResult.finish, onRendered])

	return (
		<>
			{canRendered && (
				<S.CmdContainer style={baseCommand?.display?.style || {}}>
					{!baseCommand?.display?.hideCmd && (
						<S.CmdLine restricted={command.restricted}>
							<strong>{app.logo}</strong>{" "}
							<span>
								{name} {args}
							</span>
						</S.CmdLine>
					)}

					<S.CmdResult style={baseCommand?.display?.stylePre || {}}>
						{baseCommand?.display?.highlight
							? baseCommand?.display?.highlight(displayResult.txt)
							: highlight(
									displayResult.txt,
									(name, args) => {
										onClickCommand(name, args)
									},
									lang
							  )}
					</S.CmdResult>

					{baseCommand?.JSX && baseCommand.JSX()}
				</S.CmdContainer>
			)}
		</>
	)
}

export const MemoCommand = React.memo(Command, (prevProps, nextProps) => {
	return (
		prevProps.lang === nextProps.lang &&
		prevProps.command.visible === nextProps.command.visible &&
		prevProps.canRendered === nextProps.canRendered
	)
})
