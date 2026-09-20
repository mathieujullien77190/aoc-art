"use client"

import { useCallback, useEffect, useState } from "react"

import {
	baseCommands,
	browserLang,
	CommandEvent,
	dictEn,
	dictFr,
	Dictionaries,
	setDict,
	Shell,
	themes,
	useShell,
} from "flower-shell"

import { commands as customCommands } from "_commands/commands"
import { syncUrl } from "_commands/url"

import Layout from "_components/Layout"
import Computer from "_components/ComputerLayout/Computer"
import Flowers from "_components/Flowers"

import { globalActions } from "_store/global/"
import {
	bindShell,
	shellRun,
	shellRunWhenReady,
	shellState,
	SHELL_ID,
} from "_store/shell/"

import { app } from "_components/constants"

import { isMobile } from "react-device-detect"

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
	},
}

/**
 * browserLang lit les langues montees : sans ce depot au niveau du module,
 * il ne connaitrait que l'anglais du paquet et le francais ne sortirait
 * jamais.
 */
setDict(dict)

/**
 * La ligne portee par l'ancien lien profond : #aoc_1 lance +aoc 1+. Rien au
 * prerendu, location n'y existe pas.
 */
const deepLink = (): string[] => {
	if (typeof location === "undefined" || !location.hash.includes("#")) return []

	return [location.hash.substring(1).split("_").join(" ")]
}

type HomeProps = {
	/** la commande jouee a l'arrivee : la route /aoc/5 donne "aoc 5" */
	command?: string
}

export const Home = ({ command }: HomeProps) => {
	const shell = useShell()

	/**
	 * L'ouverture, lue une fois. Elle ne peut pas partir d'ici : le shell
	 * n'est monte qu'a la fin de la sequence de boot, et jouer une ligne
	 * avant ca ne trouve aucun terminal. Le shell la joue en arrivant.
	 * La route prime, le #hash reste pour les liens deja partages.
	 */
	const [opening] = useState<string[]>(() => [
		"title",
		"welcome",
		...(command ? [command] : deepLink()),
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
	const handleCommandDone = useCallback((event: CommandEvent) => {
		const { name } = event

		// l'adresse suit la commande : `aoc 5` donne /aoc/5
		syncUrl(event)

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
	}, [])

	// avant tout le reste : une commande n'est pas un rendu React, elle
	// joue dans le terminal par ce relais
	useEffect(() => {
		bindShell(shell)
	}, [shell])

	useEffect(() => {
		const lang = browserLang()

		// layout.tsx fige l'attribut a fr, il vaut pour tout le monde
		document.documentElement.lang = lang
		globalActions().setProperty("lang", lang)
	}, [])

	return (
		<Layout onClick={handleClick}>
			<Computer
				onRunCommand={shellRunWhenReady}
				onCloseWindow={() => shellRun("clear")}
			>
				<Shell
					id={SHELL_ID}
					commands={commands}
					// tout le catalogue du paquet : le visiteur en change par
					// la commande theme, et help theme les liste
					themes={themes}
					theme="flower"
					dict={dict}
					lang={browserLang()}
					initialCommands={opening}
					onCommandDone={handleCommandDone}
				/>
			</Computer>

			<Flowers />
		</Layout>
	)
}
