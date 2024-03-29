/** @format */

import React, { useCallback, useEffect, useRef } from "react"

import { sendRestrictedCommand, sendCommand } from "_commands/helpers"

import Layout from "_components/Layout"
import Terminal from "_components/Terminal"

import { useAppDispatch } from "_store/hooks"
import {
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
import Computer from "_components/ComputerLayout/Computer"
import styled from "styled-components"

export const Button = styled.div`
	position: absolute;
	z-index: 10000;
	top: 27px;
	right: 22px;
	display: none;

	@media (min-width: 1024px) {
		display: block;
	}

	border: solid 2px #000000;
	padding: 12px;
	background-color: #ffffff;
	cursor: pointer;
	opacity: 0.2;

	&:hover {
		background-color: gray;
		opacity: 1;
	}
`

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

	const containerRef = useRef<HTMLDivElement>(null)

	const handleRendered = useCallback(
		(id: string) => {
			dispatch(setIsRendered(id))
			containerRef.current.scrollTo(0, 1000000)
		},
		[dispatch]
	)

	const handleAnimate = useCallback(() => {
		containerRef.current.scrollTo(0, 1000000)
	}, [dispatch])

	const handleClick = useCallback(() => {
		if (isMobile) {
			handleSetCursor(-1)
		}
	}, [isMobile])

	const handleSetCursor = useCallback(
		(direction: number) => {
			dispatch(moveCursor(direction))
		},
		[dispatch]
	)

	const handleSendCommand = (commandPattern: string) => {
		sendCommand(commandPattern, dispatch)
	}

	useEffect(() => {
		sendRestrictedCommand("title", dispatch)
		sendRestrictedCommand("welcome", dispatch)
	}, [sendRestrictedCommand, sendCommand])

	useEffect(() => {
		if (start) {
			sendCommand("aoc", dispatch)
			if (location.hash.includes("#")) {
				sendCommand(location.hash.substring(1).split("_").join(" "), dispatch)
			}
		}
	}, [start])

	return (
		<Layout onClick={handleClick}>
			<Computer
				ref={containerRef}
				onCloseWindow={() => {
					sendCommand("clear", dispatch)
				}}
			>
				<Terminal
					options={options}
					commands={commands}
					currentCommand={currentCommand}
					onSendCommand={handleSendCommand}
					onAnimateCommand={handleAnimate}
					onSendRestrictedCommand={commandPattern =>
						sendRestrictedCommand(commandPattern, dispatch)
					}
					onSendPreviousCommand={() => handleSetCursor(-1)}
					onSendNextCommand={() => handleSetCursor(1)}
					onRendered={handleRendered}
				/>
			</Computer>
		</Layout>
	)
}

export default Home
