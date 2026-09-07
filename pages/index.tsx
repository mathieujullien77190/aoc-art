import React, { useCallback, useEffect, useState } from "react"

import {
	baseCommands,
	browserLang,
	CommandEvent,
	dictEn,
	dictFr,
	Dict,
	Dictionaries,
	setDict,
	Shell,
	ShellThemes,
	useShell,
} from "flower-shell"

import { commands as customCommands } from "_commands/commands"

import Layout from "_components/Layout"
import Computer from "_components/ComputerLayout/Computer"
import Tutorial from "_components/ComputerLayout/Tutorial"
import Flowers from "_components/Flowers"

import { globalActions } from "_store/global/"
import { bindShell, shellRun, shellState, SHELL_ID } from "_store/shell/"

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
const commands = { ...baseCommands, ...customCommands }

/**
 * Les textes : ceux du paquet, dont on ne recouvre que le mot d'accueil.
 * Chaque langue est posee en entier — le paquet rabat sur son anglais ce
 * qu'un dictionnaire ne couvre pas, un fr partiel perdrait son francais.
 */
const dict: Dictionaries = {
	fr: {
		...dictFr,
		welcome: {
			text: [
				`Bienvenue sur $${app.name}$`,
				"Commencez par taper la commande : `help`",
				"\n",
			].join("\n"),
		},
		// le paquet decrit chaque theme par la cle theme.<nom> ; sans elle,
		// help theme afficherait la cle brute
		theme: { ...(dictFr.theme as Dict), aoc: "les couleurs du site" },
	},
	en: {
		...dictEn,
		welcome: {
			text: [
				`$Welcome to ${app.name}$`,
				"\n",
				"Start by typing the command: `help`",
				"\n",
			].join("\n"),
		},
		theme: { ...(dictEn.theme as Dict), aoc: "the colors of the site" },
	},
}

/**
 * browserLang lit les langues montees : sans ce depot au niveau du module,
 * il ne connaitrait que l'anglais du paquet et le francais ne sortirait
 * jamais.
 */
setDict(dict)

/**
 * Le seul theme du site. invisible est pose a la main : c'est toujours le
 * fond, et le laisser au theme du paquet le figerait sur le sien.
 */
const themes: ShellThemes = {
	aoc: {
		colors: {
			background: colors.background,
			textColor: colors.textColor,
			importantColor: colors.importantColor,
			cmdColor: colors.cmdColor,
			restrictedColor: colors.restrictedColor,
			infoColor: colors.infoColor,
			appColor: colors.appColor,
			invisible: colors.background,
		},
		prompt: app.logo,
		/**
		 * Le cadre du terminal. Il faut le poser : sans lui on herite de
		 * celui du theme du paquet, qui encadre le shell d'un liseré jaune
		 * et le decale de 20px — la fenetre du bureau fait deja le cadre.
		 */
		container: { padding: "8px", border: "none" },
	},
}

/**
 * La ligne portee par le lien profond : #aoc_1 lance +aoc 1+. Rien au
 * prerendu, location n'y existe pas.
 */
const deepLink = (): string[] => {
	if (typeof location === "undefined" || !location.hash.includes("#")) return []

	return [location.hash.substring(1).split("_").join(" ")]
}

const Home = () => {
	const shell = useShell()

	/**
	 * L'ouverture, lue une fois. Elle ne peut pas partir d'ici : le shell
	 * n'est monte qu'a la fin de la sequence de boot, et jouer une ligne
	 * avant ca ne trouve aucun terminal. Le shell la joue en arrivant.
	 */
	const [opening] = useState<string[]>(() => [
		"title",
		"welcome",
		...deepLink(),
	])

	const handleClick = useCallback(() => {
		// sur mobile, un clic remonte la commande precedente
		if (isMobile) shellState()?.moveCursor(-1)
	}, [])

	/**
	 * Ce que le bureau fait des commandes du shell. Le paquet ne connait ni
	 * les plantes ni le virus : sa commande flowers ne dessine que son ascii,
	 * c'est ici qu'on la prend au vol pour semer sur les cotes de l'ecran.
	 */
	const handleCommandDone = useCallback(({ name }: CommandEvent) => {
		if (name === "flowers") globalActions().setProperty("flowers", Date.now())

		// le bureau se remet a neuf en meme temps que l'ecran
		if (name === "clear") {
			globalActions().setProperty("flowers", 0)
			globalActions().setProperty("virus", 0)
		}

		// la langue appartient au shell : le bureau la recopie pour la suivre
		if (name === "lang") {
			const lang = shellState()?.lang
			if (lang) globalActions().setProperty("lang", lang)
		}

		// la visite guidee attend certaines commandes
		globalActions().pushCommand(name)
	}, [])

	// avant tout le reste : une commande n'est pas un rendu React, elle
	// joue dans le terminal par ce relais
	useEffect(() => {
		bindShell(shell)
	}, [shell])

	useEffect(() => {
		const lang = browserLang()

		// _document fige l'attribut a fr, il vaut pour tout le monde
		document.documentElement.lang = lang
		globalActions().setProperty("lang", lang)
	}, [])

	return (
		<Layout onClick={handleClick}>
			<Computer onRunCommand={shellRun} onCloseWindow={() => shellRun("clear")}>
				<Shell
					id={SHELL_ID}
					commands={commands}
					themes={themes}
					theme="aoc"
					dict={dict}
					lang={browserLang()}
					initialCommands={opening}
					onCommandDone={handleCommandDone}
				/>
			</Computer>

			<Tutorial />

			<Flowers />
		</Layout>
	)
}

export default Home
