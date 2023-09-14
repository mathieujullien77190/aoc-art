/** @format */

import { BaseCommand, Help } from "_/types"

import { colors, app } from "_components/constants"

import { title, highlightFlower, plantFlowers } from "./asciArt"
import { displayList, loadScript, getScript } from "./aocCommands"

import { Games } from "_games/Games"
import { gamesConfig } from "_games/constants"

import { setProperties } from "_store/global/"
import { clear } from "_store/history/"

const textHelp = (help: Help) => {
	const patterns = help.patterns
		.map(item => `\t${item.pattern} : ${item.description}\n`)
		.join("")
	return `${help.description || ""}${
		help.patterns.length > 0 ? "\n" : ""
	}${patterns}`
}

const allCommandsHelp = (commands: BaseCommand[]) => {
	return commands
		.filter(
			command => !command.restricted && command.help && command.name !== "help"
		)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(command => {
			return `+${command.name}+\n${command.help.patterns
				.map(pattern => `\t${pattern.pattern} : ${pattern.description}\n`)
				.join("")}\n`
		})
		.join("")
}

const commandHelp = (commands: BaseCommand[], name: string): Help | null => {
	const select = commands.filter(command => command.name === name)[0]
	return select?.help || null
}

export const commands: BaseCommand[] = [
	{
		restricted: true,
		name: "welcome",
		action: () => {
			return [
				"\n",
				`Bienvenue, Vous êtes sur $${app.name}$.`,
				"\n",
				"Pour voir le ASCII Art d'un jour précis tapez : `aoc [index]` ou `aoc [date]` ou `aoc [string]`",
				"Pour lister tout les scripts tapez : `aoc list`",
				"Pour obtenir plus d'information tapez : `help` ",
			].join("\n")
		},
		help: {
			description:
				"Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
			patterns: [],
		},
		display: {
			hideCmd: true,
			style: { color: colors.importantColor },
		},
	},
	{
		restricted: true,
		name: "title",
		action: () => {
			return title
		},
		help: {
			description:
				"Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
			patterns: [],
		},
		display: {
			hideCmd: true,
			style: { alignItems: "center" },
			stylePre: { fontSize: "calc(100vw/100)" },
			highlight: text => highlightFlower(text, { fontSize: "calc(100vw/100)" }),
			trad: false,
		},
	},
	{
		restricted: true,
		name: "unknow",
		action: ({ args }) => {
			return `${args[0]} n’est pas reconnu en tant que commande interne, tapez \`help\` pour afficher la liste des commandes`
		},
		help: {
			description:
				"Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
			patterns: [],
		},
	},
	{
		restricted: true,
		name: "argumenterror",
		action: () => {
			return "argument(s) non reconnu"
		},
		help: {
			description:
				"Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
			patterns: [],
		},
	},
	{
		restricted: false,
		name: "help",
		action: ({ args, help, commands }) => {
			if (args.length === 0) {
				return `${textHelp(help)}\nListe des commandes : \n\n${allCommandsHelp(
					commands
				)}`
			} else {
				const select = commandHelp(commands, args[0])

				if (select) return textHelp(select)
				return "Cette commande n’existe pas"
			}
		},
		help: {
			description: `Fournit des informations d’aide sur les commandes du $${app.name}$`,
			patterns: [
				{
					pattern: "help [command]",
					description: "affiche des informations d’aide sur [command]",
				},
			],
		},
	},
	{
		restricted: false,
		name: "aoc",
		action: ({ args }) => {
			if (args[0] === "list" || args.length === 0) {
				return displayList(gamesConfig)
			} else {
				return loadScript(args, gamesConfig)
			}
		},
		redux: ({ args }) => {
			if (getScript(args, gamesConfig)) {
				return setProperties({
					key: "keyboardOnFocus",
					value: false,
				})
			}
			return undefined
		},

		JSX: ({ args }) => {
			const script = getScript(args, gamesConfig)

			return script ? <Games day={script.day} year={script.year} /> : <></>
		},

		help: {
			description: "Affiche l'exercice du jour En ASCII Art ",
			patterns: [
				{
					pattern: "aoc [index]",
					description: '+aoc 1+ => Lancera "Calorie Counting"',
				},
				{
					pattern: "aoc [year]-[date]",
					description: '+aoc 2022-12+ => Lancera "Hill Climbing Algorithm"',
				},
				{
					pattern: "aoc [string]",
					description: '+aoc cuc+ => Lancera "Sea Cucumber"',
				},
				{
					pattern: "aoc list",
					description: "Liste tout les scripts",
				},
			],
		},
		display: {
			animation: false,
		},
	},
	{
		restricted: true,
		name: "closeaoc",
		action: ({ args }) => {
			return "script close"
		},
		redux: () => {
			return setProperties({
				key: "keyboardOnFocus",
				value: true,
			})
		},
		help: {
			description:
				"Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
			patterns: [],
		},
	},
	{
		restricted: false,
		name: "hello",
		action: ({ args }) => {
			return args.length === 0 ? "Hello le monde" : `Hello ${args.join(" ")}`
		},
		help: {
			description: "Affiche du texte à l'écran",
			patterns: [
				{
					pattern: "hello",
					description: "Affiche `Hello world`",
				},
				{
					pattern: "hello [text]",
					description: "Affiche `Hello [text]`",
				},
			],
		},
	},
	{
		restricted: false,
		name: "clear",
		action: () => {
			return ""
		},
		redux: () => {
			return clear()
		},
		help: {
			patterns: [
				{
					pattern: "clear",
					description: "Efface tout sauf l'historique",
				},
			],
		},
	},
	{
		restricted: false,
		name: "about",
		action: () => {
			return [
				`\n| $${app.name}$`,
				`| Créée par §${app.author}§ alias §${app.alias}§ `,
				"| Technos utilisées : React/Redux | NextJs | NodeJs | TypeScript",
			].join("\n")
		},

		help: {
			patterns: [
				{
					pattern: "about",
					description: "Affiche différentes informations inutile",
				},
			],
		},
	},
	{
		restricted: false,
		name: "animation",
		testArgs: { authorize: ["on", "off"], empty: false },
		action: ({ args }) => {
			return args[0] === "on" ? "activé" : "désactiver"
		},
		redux: ({ args }) => {
			return setProperties({
				key: "animation",
				value: args[0] === "on" ? true : false,
			})
		},

		help: {
			patterns: [
				{
					pattern: "animation on",
					description: "Active les animations",
				},
				{
					pattern: "debug off",
					description: "désactive les animations",
				},
			],
		},
	},
	{
		restricted: false,
		name: "flowers",
		action: () => {
			return plantFlowers()
		},
		display: {
			stylePre: {
				fontSize: "calc(100vw/60)",
				color: colors.appColor,
				transform: "scaleX(-1)",
				textAlign: "right",
			},
			highlight: text => highlightFlower(text, { fontSize: "calc(100vw/60)" }),
			trad: false,
			reverse: true,
			stepTime: 1,
			stepSize: 1,
		},
		help: {
			patterns: [
				{
					pattern: "flowers",
					description: `${app.logo}${app.logo}${app.logo} Plantez des fleurs ${app.logo}${app.logo}${app.logo}`,
				},
			],
		},
	},
	{
		restricted: false,
		name: "lang",
		testArgs: { authorize: ["fr", "leet", "xleet", "#"], empty: false },
		action: ({ args }) => {
			return `langage : ${args[0]}`
		},
		redux: ({ args }) => {
			return setProperties({
				key: "lang",
				value: args[0],
			})
		},
		help: {
			patterns: [
				{
					pattern: "lang fr",
					description:
						"Affiche tout les textes en français (attention les commandes restent en anglais)",
				},
				{
					pattern: "lang leet",
					description: "Affiche tout les textes en leet (version lisible)",
				},
				{
					pattern: "lang xleet",
					description: "Affiche tout les textes en xleet (version ilisible)",
				},
				{
					pattern: `lang #`,
					description: `Remplace toute les lettres par \`${app.logo}\` (version inutile)`,
				},
			],
		},
	},
]
