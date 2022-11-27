/** @format */

import React, { useCallback, useEffect } from "react"

import { findCommand } from "_commands/data"
import { createCommand } from "_commands/terminalEngine"

import Layout from "_components/Layout"
import Terminal from "_components/Terminal"

import { useAppDispatch } from "_store/hooks"
import {
	addCommand,
	moveCursor,
	setIsRendered,
	useGetCommands,
	useGetCurrentCommand,
} from "_store/history/"
import { useGetLanguage, useGetAnimation } from "_store/global/"

import { isMobile } from "react-device-detect"

const Home = () => {
	const dispatch = useAppDispatch()
	const commands = useGetCommands()
	const options = { animation: useGetAnimation(), lang: useGetLanguage() }
	const currentCommand = useGetCurrentCommand()

	const handleRendered = useCallback(
		(id: string) => {
			dispatch(setIsRendered(id))
		},
		[dispatch]
	)

	const handleSendRestrictedCommand = useCallback(
		(commandPattern: string) => {
			const cmd = createCommand(commandPattern, true)
			const baseCmd = findCommand(cmd.name, true)

			if (baseCmd?.redux && cmd.canExecute)
				dispatch(baseCmd.redux({ args: cmd.args }))

			dispatch(addCommand(createCommand(commandPattern, true)))
		},
		[dispatch]
	)

	const handleClick = useCallback(() => {
		if (isMobile) {
			handleSetCursor(-1)
		}
	}, [isMobile])

	const handleSendCommand = useCallback(
		(commandPattern: string) => {
			const cmd = createCommand(commandPattern, false)
			const baseCmd = findCommand(cmd.name, false)

			if (baseCmd?.redux && cmd.canExecute)
				dispatch(baseCmd.redux({ args: cmd.args }))

			if (cmd.name === "clear" && cmd.canExecute) {
				handleSendRestrictedCommand("title")
				handleSendRestrictedCommand("welcome")
			}

			dispatch(addCommand(cmd))
		},
		[dispatch]
	)

	const handleSetCursor = useCallback(
		(direction: number) => {
			dispatch(moveCursor(direction))
		},
		[dispatch]
	)

	useEffect(() => {
		handleSendRestrictedCommand("title")
		handleSendRestrictedCommand("welcome")
	}, [handleSendRestrictedCommand, handleSendCommand])

	return (
		<Layout onClick={handleClick}>
			<>
				<Terminal
					options={options}
					commands={commands}
					currentCommand={currentCommand}
					onSendCommand={handleSendCommand}
					onSendRestrictedCommand={handleSendRestrictedCommand}
					onSendPreviousCommand={() => handleSetCursor(-1)}
					onSendNextCommand={() => handleSetCursor(1)}
					onRendered={handleRendered}
				/>
			</>
		</Layout>
	)
}

export default Home
