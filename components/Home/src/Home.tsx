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

/** the shell knows its commands, then this site's */
const commands = { ...baseCommands, ...customCommands }

/**
 * Texts: the package's, with only the welcome message overridden. Each
 * language is set in full — the package falls back to its English for what
 * a dictionary lacks, so a partial fr would lose its French.
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
 * browserLang reads the mounted languages: without this module-level
 * registration it would only know the package's English and French would
 * never come out.
 */
setDict(dict)

/**
 * The line carried by the old deep link: #aoc_1 plays `aoc 1`. Nothing at
 * prerender, location does not exist there.
 */
const deepLink = (): string[] => {
	if (typeof location === "undefined" || !location.hash.includes("#")) return []

	return [location.hash.substring(1).split("_").join(" ")]
}

type HomeProps = {
	/** the command played on arrival: the /aoc/5 route gives "aoc 5" */
	command?: string
}

export const Home = ({ command }: HomeProps) => {
	const shell = useShell()

	/**
	 * The opening, read once. It cannot be played from here: the shell only
	 * mounts at the end of the boot sequence, and a line played before that
	 * finds no terminal. The shell plays it on arrival. The route wins, the
	 * #hash stays for links already shared.
	 */
	const [opening] = useState<string[]>(() => [
		"title",
		"welcome",
		...(command ? [command] : deepLink()),
	])

	const handleClick = useCallback(() => {
		// on mobile, a click brings back the previous command
		if (isMobile) shellState()?.moveCursor(-1)
	}, [])

	/**
	 * What the desktop does with shell commands. The package knows neither the
	 * plants nor the virus: its flowers command only draws its ASCII, so it is
	 * caught here to sow the sides of the screen.
	 */
	const handleCommandDone = useCallback((event: CommandEvent) => {
		const { name } = event

		// the address follows the command: `aoc 5` gives /aoc/5
		syncUrl(event)

		if (name === "flowers") globalActions().setProperty("flowers", Date.now())

		// the desktop resets along with the screen
		if (name === "clear") {
			globalActions().setProperty("flowers", 0)
			globalActions().setProperty("virus", 0)
		}

		// the language belongs to the shell: the desktop copies it to follow
		if (name === "lang") {
			const lang = shellState()?.lang
			if (lang) globalActions().setProperty("lang", lang)
		}
	}, [])

	// before anything else: a command is not a React render, it plays in the
	// terminal through this relay
	useEffect(() => {
		bindShell(shell)
	}, [shell])

	useEffect(() => {
		const lang = browserLang()

		// layout.tsx sets fr for everyone: override with the visitor's language
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
					// the package's whole catalogue: the visitor changes it with the
					// theme command, and help theme lists them
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
