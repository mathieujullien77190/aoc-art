import { BaseCommand, Help, Translatable } from "_/types"

import { colors, app } from "_components/constants"

import { title, highlightFlower, plantFlowers } from "./asciArt"
import { displayList, loadScript, getScript } from "./aocCommands"
import { LANGS, pick } from "./lang"

import Virus from "_components/Virus"

import { Games } from "_games/Games"
import { gamesConfig } from "_games/constants"

import { setProperties } from "_store/global/"
import { clear } from "_store/history/"

const RESTRICTED: Translatable = {
	fr: "Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
	en: "This is a restricted command, you cannot use it",
}

const buildHelp = (help: Help, lang: string) => {
	const patterns = help.patterns
		.map(item => `\t${item.pattern} : ${pick(item.description, lang)}\n`)
		.join("")
	return `${help.description ? pick(help.description, lang) : ""}${
		help.patterns.length > 0 ? "\n" : ""
	}${patterns}`
}

// l'aide est assemblee avant d'atteindre trad : on produit donc les deux
// variantes ici, sinon le texte final serait fige dans une seule langue
const textHelp = (help: Help): Translatable => ({
	fr: buildHelp(help, "fr"),
	en: buildHelp(help, "en"),
})

const buildAllHelp = (commands: BaseCommand[], lang: string) =>
	commands
		.filter(
			command => !command.restricted && command.help && command.name !== "help"
		)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(
			command =>
				`+${command.name}+\n${command.help.patterns
					.map(
						pattern =>
							`\t${pattern.pattern} : ${pick(pattern.description, lang)}\n`
					)
					.join("")}\n`
		)
		.join("")

const allCommandsHelp = (commands: BaseCommand[]) => ({
	fr: buildAllHelp(commands, "fr"),
	en: buildAllHelp(commands, "en"),
})

const commandHelp = (commands: BaseCommand[], name: string): Help | null => {
	const select = commands.filter(command => command.name === name)[0]
	return select?.help || null
}

export const commands: BaseCommand[] = [
	{
		restricted: true,
		name: "welcome",
		action: () => ({
			fr: [
				"Pour visualiser les ASCII Art AOC tapez : `aoc list`",
				"Pour visualiser un ASCII Art AOC tapez : `aoc [index]` (ex: aoc 5)",
				"\n",
				"Pour plus d'informations sur l'auteur tapez : `about`",
				"\n",
				"Pour afficher toutes les commandes tapez : `help`",
				"\n",
			].join("\n"),
			en: [
				"To browse the AOC ASCII art type: `aoc list`",
				"To view one AOC ASCII art type: `aoc [index]` (ex: aoc 5)",
				"\n",
				"For more about the author type: `about`",
				"\n",
				"To list every command type: `help`",
				"\n",
			].join("\n"),
		}),
		help: { description: RESTRICTED, patterns: [] },
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
		help: { description: RESTRICTED, patterns: [] },
		display: {
			hideCmd: true,
			style: { alignItems: "center" },
			stylePre: { fontSize: "calc(100vw/130)" },
			highlight: text => highlightFlower(text, { fontSize: "calc(100vw/130)" }),
			trad: false,
		},
	},
	{
		restricted: true,
		name: "unknow",
		action: ({ args }) => ({
			fr: `${args[0]} n’est pas reconnu en tant que commande interne, tapez \`help\` pour afficher la liste des commandes`,
			en: `${args[0]} is not recognised as an internal command, type \`help\` to list the commands`,
		}),
		help: { description: RESTRICTED, patterns: [] },
	},
	{
		restricted: true,
		name: "argumenterror",
		action: () => ({
			fr: "argument(s) non reconnu",
			en: "unrecognised argument(s)",
		}),
		help: { description: RESTRICTED, patterns: [] },
	},
	{
		restricted: false,
		name: "help",
		action: ({ args, help, commands }) => {
			if (args.length === 0) {
				const own = textHelp(help)
				const all = allCommandsHelp(commands)
				return {
					fr: `${own["fr"]}\nListe des commandes : \n\n${all.fr}`,
					en: `${own["en"]}\nCommand list: \n\n${all.en}`,
				}
			}

			const select = commandHelp(commands, args[0])
			if (select) return textHelp(select)

			return {
				fr: "Cette commande n’existe pas",
				en: "This command does not exist",
			}
		},
		help: {
			description: {
				fr: `Fournit des informations d’aide sur les commandes du $${app.name}$`,
				en: `Provides help about the $${app.name}$ commands`,
			},
			patterns: [
				{
					pattern: "help [command]",
					description: {
						fr: "affiche des informations d’aide sur [command]",
						en: "shows help about [command]",
					},
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
			description: {
				fr: "Affiche l'exercice du jour En ASCII Art ",
				en: "Displays the day's puzzle as ASCII art",
			},
			patterns: [
				{
					pattern: "aoc [index]",
					description: {
						fr: '+aoc 1+ => Lancera "Calorie Counting"',
						en: '+aoc 1+ => runs "Calorie Counting"',
					},
				},
				{
					pattern: "aoc [year]-[date]",
					description: {
						fr: '+aoc 2022-12+ => Lancera "Hill Climbing Algorithm"',
						en: '+aoc 2022-12+ => runs "Hill Climbing Algorithm"',
					},
				},
				{
					pattern: "aoc [string]",
					description: {
						fr: '+aoc cuc+ => Lancera "Sea Cucumber"',
						en: '+aoc cuc+ => runs "Sea Cucumber"',
					},
				},
				{
					pattern: "aoc list",
					description: {
						fr: "Liste tout les scripts",
						en: "Lists every script",
					},
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
		action: () => {
			return "script close"
		},
		redux: () => {
			return setProperties({
				key: "keyboardOnFocus",
				value: true,
			})
		},
		help: { description: RESTRICTED, patterns: [] },
	},
	{
		restricted: false,
		name: "hello",
		action: ({ args }) =>
			args.length === 0
				? { fr: "Hello le monde", en: "Hello world" }
				: `Hello ${args.join(" ")}`,
		help: {
			description: {
				fr: "Affiche du texte à l'écran",
				en: "Prints text to the screen",
			},
			patterns: [
				{
					pattern: "hello",
					description: {
						fr: "Affiche `Hello world`",
						en: "Prints `Hello world`",
					},
				},
				{
					pattern: "hello [text]",
					description: {
						fr: "Affiche `Hello [text]`",
						en: "Prints `Hello [text]`",
					},
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
					description: {
						fr: "Efface tout sauf l'historique",
						en: "Clears everything except the history",
					},
				},
			],
		},
	},
	{
		restricted: false,
		name: "about",
		action: () => ({
			fr: [
				`\n| $${app.name}$`,
				`| Créée par §${app.author}§ alias §${app.alias}§ `,
				"| Technos utilisées : React/Redux | NextJs | NodeJs | TypeScript",
			].join("\n"),
			en: [
				`\n| $${app.name}$`,
				`| Created by §${app.author}§ aka §${app.alias}§ `,
				"| Built with : React/Redux | NextJs | NodeJs | TypeScript",
			].join("\n"),
		}),

		help: {
			patterns: [
				{
					pattern: "about",
					description: {
						fr: "Affiche différentes informations inutile",
						en: "Shows assorted useless information",
					},
				},
			],
		},
	},
	{
		restricted: false,
		name: "animation",
		testArgs: { authorize: ["on", "off"], empty: false },
		action: ({ args }) =>
			args[0] === "on"
				? { fr: "activé", en: "enabled" }
				: { fr: "désactiver", en: "disabled" },
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
					description: {
						fr: "Active les animations",
						en: "Enables animations",
					},
				},
				{
					pattern: "animation off",
					description: {
						fr: "désactive les animations",
						en: "Disables animations",
					},
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
				fontSize: "calc(100cqw/60)",
				color: colors.appColor,
				transform: "scaleX(-1)",
				textAlign: "right",
			},
			highlight: text => highlightFlower(text, { fontSize: "calc(100cqw/60)" }),
			trad: false,
			reverse: true,
			stepTime: 1,
			stepSize: 1,
		},
		help: {
			patterns: [
				{
					pattern: "flowers",
					description: {
						fr: `${app.logo}${app.logo}${app.logo} Plantez des fleurs ${app.logo}${app.logo}${app.logo}`,
						en: `${app.logo}${app.logo}${app.logo} Plant some flowers ${app.logo}${app.logo}${app.logo}`,
					},
				},
			],
		},
	},
	{
		restricted: false,
		name: "stux",
		action: () => ({
			fr: "infection en cours, impossible d'interrompre le processus",
			en: "infection in progress, the process cannot be stopped",
		}),
		JSX: () => <Virus />,
		help: {
			patterns: [
				{
					pattern: "stux",
					description: {
						fr: "fonctionnalité expérimentale et inutile",
						en: "experimental and useless feature",
					},
				},
			],
		},
	},
	{
		restricted: false,
		name: "lang",
		testArgs: { authorize: LANGS, empty: false },
		action: ({ args }) => ({
			fr: `langage : ${args[0]}`,
			en: `language: ${args[0]}`,
		}),
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
					description: {
						fr: "Affiche tout les textes en français (attention les commandes restent en anglais)",
						en: "Shows every text in French (commands stay in English)",
					},
				},
				{
					pattern: "lang en",
					description: {
						fr: "Affiche tout les textes en anglais",
						en: "Shows every text in English",
					},
				},
				{
					pattern: "lang leet",
					description: {
						fr: "Affiche tout les textes en leet (version lisible)",
						en: "Shows every text in leet (readable version)",
					},
				},
				{
					pattern: "lang xleet",
					description: {
						fr: "Affiche tout les textes en xleet (version ilisible)",
						en: "Shows every text in xleet (unreadable version)",
					},
				},
				{
					pattern: `lang #`,
					description: {
						fr: `Remplace toute les lettres par \`${app.logo}\` (version inutile)`,
						en: `Replaces every letter with \`${app.logo}\` (useless version)`,
					},
				},
			],
		},
	},
]
