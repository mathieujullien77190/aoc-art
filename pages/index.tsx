import React, { useCallback, useEffect, useRef } from "react"

import { sendRestrictedCommand, sendCommand } from "_commands/helpers"
import { browserLang } from "_commands/lang"

import Layout from "_components/Layout"
import Terminal from "_components/Terminal"

import {
	historyActions,
	useGetCommands,
	useGetCurrentCommand,
	useGetStart,
} from "_store/history/"
import {
	globalActions,
	useGetLanguage,
	useGetAnimation,
	useGetKeyboardOnFocus,
} from "_store/global/"

import { isMobile } from "react-device-detect"
import Computer from "_components/ComputerLayout/Computer"
import Tutorial from "_components/ComputerLayout/Tutorial"
import Flowers from "_components/Flowers"
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
	const commands = useGetCommands()
	const options = {
		animation: useGetAnimation(),
		lang: useGetLanguage(),
		keyboardOnFocus: useGetKeyboardOnFocus(),
	}
	const currentCommand = useGetCurrentCommand()
	const start = useGetStart()

	const containerRef = useRef<HTMLDivElement>(null)

	const handleRendered = useCallback((id: string) => {
		historyActions().setIsRendered(id)
		containerRef.current.scrollTo(0, 1000000)
	}, [])

	const handleAnimate = useCallback(() => {
		containerRef.current.scrollTo(0, 1000000)
	}, [])

	const handleSetCursor = useCallback((direction: number) => {
		historyActions().moveCursor(direction)
	}, [])

	const handleClick = useCallback(() => {
		if (isMobile) {
			handleSetCursor(-1)
		}
	}, [handleSetCursor])

	const handleSendCommand = (commandPattern: string) => {
		sendCommand(commandPattern)
	}

	useEffect(() => {
		const lang = browserLang()

		// avant le boot : la premiere ligne s'ecrit deja dans la bonne langue
		globalActions().setProperty("lang", lang)

		// _document fige l'attribut a fr, il vaut pour tout le monde
		document.documentElement.lang = lang

		sendRestrictedCommand("title")
		sendRestrictedCommand("welcome")
	}, [])

	useEffect(() => {
		if (start && location.hash.includes("#")) {
			sendCommand(location.hash.substring(1).split("_").join(" "))
		}
	}, [start])

	return (
		<Layout onClick={handleClick}>
			<Computer
				ref={containerRef}
				onRunCommand={handleSendCommand}
				onCloseWindow={() => {
					sendCommand("clear")
				}}
			>
				<Terminal
					options={options}
					commands={commands}
					currentCommand={currentCommand}
					onSendCommand={handleSendCommand}
					onAnimateCommand={handleAnimate}
					onSendRestrictedCommand={sendRestrictedCommand}
					onSendPreviousCommand={() => handleSetCursor(-1)}
					onSendNextCommand={() => handleSetCursor(1)}
					onRendered={handleRendered}
				/>
			</Computer>

			<Tutorial />

			<Flowers />
		</Layout>
	)
}

export default Home
