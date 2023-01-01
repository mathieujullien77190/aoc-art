/** @format */

import React, { useCallback, useEffect } from "react"

import { commands as baseCommands } from "_commands/commands"
import { createCommand, findCommand } from "_commands/terminalEngine"

import Layout from "_components/Layout"
import Terminal from "_components/Terminal"

import { useAppDispatch } from "_store/hooks"
import {
	addCommand,
	moveCursor,
	setIsRendered,
	useGetCommands,
	useGetCurrentCommand,
	useGetStart,
} from "_store/history/"
import {
	useGetLanguage,
	useGetAnimation,
	useGetKeyboardOnFocus,
} from "_store/global/"

import { isMobile } from "react-device-detect"

const Home = () => {
	const dispatch = useAppDispatch()
	const commands = useGetCommands()
	const options = {
		animation: useGetAnimation(),
		lang: useGetLanguage(),
		keyboardOnFocus: useGetKeyboardOnFocus(),
	}
	const currentCommand = useGetCurrentCommand()
	const start = useGetStart()

	const handleRendered = useCallback(
		(id: string) => {
			dispatch(setIsRendered(id))
		},
		[dispatch]
	)

	const handleSendRestrictedCommand = useCallback(
		(commandPattern: string) => {
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

	useEffect(() => {
		if (start === true && location.hash.includes("#")) {
			handleSendCommand(location.hash.substring(1).split("_").join(" "))
		}
	}, [start])

	return (
		<Layout onClick={handleClick}>
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
		</Layout>
	)
}

export default Home
