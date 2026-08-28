import React, { useCallback, useEffect, useRef } from "react"

import {
	baseCommands,
	browserLang,
	run,
	shellActions,
	Shell,
	useGetStart,
} from "flower-shell"

import { commands as customCommands } from "_commands/commands"

import Layout from "_components/Layout"
import Computer from "_components/ComputerLayout/Computer"
import Tutorial from "_components/ComputerLayout/Tutorial"
import Flowers from "_components/Flowers"

import { globalActions } from "_store/global/"

import { colors, app } from "_components/constants"

import { isMobile } from "react-device-detect"
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

/** le shell connait ses commandes, puis celles de ce site */
const commands = [...baseCommands, ...customCommands]

/** le mot d'accueil, affiche sous le logo */
const welcome = {
	fr: [
		`Bienvenue sur $${app.name}$`,
		"Commencez par taper la commande : `help`",
		"\n",
	].join("\n"),
	en: [
		`$Welcome to ${app.name}$`,
		"\n",
		"Start by typing the command: `help`",
		"\n",
	].join("\n"),
}

const theme = { colors, prompt: app.logo }

/**
 * Ce que le bureau fait des commandes du shell. Le paquet ne connait ni
 * les plantes ni le virus : sa commande flowers ne dessine que son ascii,
 * c'est ici qu'on la prend au vol pour semer sur les cotes de l'ecran.
 */
const handleShellCommand = (name: string) => {
	if (name === "flowers") globalActions().setProperty("flowers", Date.now())

	// le bureau se remet a neuf en meme temps que l'ecran
	if (name === "clear") {
		globalActions().setProperty("flowers", 0)
		globalActions().setProperty("virus", 0)
	}
}

const Home = () => {
	const start = useGetStart()

	const containerRef = useRef<HTMLDivElement>(null)

	const handleClick = useCallback(() => {
		// sur mobile, un clic remonte la commande precedente
		if (isMobile) shellActions().moveCursor(-1)
	}, [])

	useEffect(() => {
		const lang = browserLang()

		// _document fige l'attribut a fr, il vaut pour tout le monde
		document.documentElement.lang = lang
	}, [])

	useEffect(() => {
		if (start && location.hash.includes("#")) {
			run(location.hash.substring(1).split("_").join(" "))
		}
	}, [start])

	return (
		<Layout onClick={handleClick}>
			<Computer
				ref={containerRef}
				onRunCommand={run}
				onCloseWindow={() => run("clear")}
			>
				<Shell
					commands={commands}
					showTitle
					welcome={welcome}
					theme={theme}
					lang={browserLang()}
					scrollRef={containerRef}
					onCommand={handleShellCommand}
				/>
			</Computer>

			<Tutorial />

			<Flowers />
		</Layout>
	)
}

export default Home
