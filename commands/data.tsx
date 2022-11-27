/** @format */
import { BaseCommand, Help } from "_/types"
import reactStringReplace from "react-string-replace"
import uniqid from "uniqid"

import { colors, app } from "_components/constants"

import { title } from "./asciArt"
import { sameLetters, strSpaces } from "./helpers"
import { scripts } from "./script"

import { setProperties } from "_store/global/"
import { clear } from "_store/history/"
import Script from "next/script"

const textHelp = (help: Help) => {
	const patterns = help.patterns
		.map(item => `\t${item.pattern} : ${item.description}\n`)
		.join("")
	return `${help.description || ""}${
		help.patterns.length > 0 ? "\n" : ""
	}${patterns}`
}

const allCommandsHelp = () => {
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

const highlightFlower = (text, baseStyles) => {
	let result = text

	const list = [
		{ reg: /R(.*)R/g, styles: { color: colors.restrictedColor } },
		{ reg: /I(.*)I/g, styles: { color: colors.importantColor } },
		{ reg: /B(.*)B/g, styles: { color: colors.infoColor } },
		{ reg: /G(.*)G/g, styles: { color: colors.appColor } },
		{ reg: /T(.*)T/g, styles: { color: colors.restrictedColor } },
		{ reg: /J(.*)J/g, styles: { color: colors.importantColor } },
		{ reg: /H(.*)H/g, styles: { color: colors.appColor } },
		{ reg: /K(.*)K/g, styles: { color: colors.restrictedColor } },
		{ reg: /X(.*)X/g, styles: { color: colors.restrictedColor } },
		{ reg: /D(.*)D/g, styles: { color: colors.appColor } },
		{ reg: /Z(.*)Z/g, styles: { color: colors.infoColor } },
	]

	list.forEach(item => {
		result = reactStringReplace(result, item.reg, (match, i) => (
			<span
				key={uniqid()}
				style={{
					...item.styles,
					...baseStyles,
				}}
			>
				{match}
			</span>
		))
	})

	return result
}

export const commands: BaseCommand[] = [
	{
		restricted: true,
		name: "welcome",
		action: () => {
			return [
				`Bienvenue, Vous êtes sur $${app.name}$.`,
				"Pour voir le ASCII Art d'un jour précis tapez : `day [nbDay]`",
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
			return { fr: `argument(s) non reconnu`, en: "xxx" }
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
		action: ({ args, help }) => {
			if (args.length === 0) {
				return `${textHelp(
					help
				)}\nListe des commandes : \n\n${allCommandsHelp()}`
			} else {
				const select = findCommand(args[0], null)
				if (select) return textHelp(select.help)
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
		name: "day",
		action: ({ args }) => {
			if (args.length === 0) {
				return `§Jour : ${scripts[scripts.length - 1].day}§\n\n${scripts[
					scripts.length - 1
				].fn()}`
			} else if (args[0]) {
				const search = scripts.filter(script => script.day === args[0])
				if (search.length === 1) {
					return `§Jour : ${search[0].day}§\n\n${search[0].fn()}`
				} else {
					return `Aucun script pour le jour §${args[0]}§`
				}
			}
		},
		help: {
			description: "Affiche l'exercice du jour En ASCII Art ",
			patterns: [
				{
					pattern: "day",
					description: "Affiche le dernier jour",
				},
				{
					pattern: "day [numero]",
					description: "Affiche un jour spécifique",
				},
			],
		},
	},
	{
		restricted: false,
		name: "hello",
		action: ({ args }) => {
			return args.length === 0
				? { fr: "Hello le monde", en: "xxx" }
				: { fr: `Hello ${args.join(" ")}`, en: "xxx" }
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
			return args[0] === "on"
				? { fr: "activé", en: "enabled" }
				: { fr: "désactiver", en: "disabled" }
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
		name: "lang",
		testArgs: { authorize: ["fr", "leet", "xleet", "#"], empty: false },
		action: ({ args }) => {
			return { fr: `langage : ${args[0]}`, en: `language : ${args[0]}` }
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

export const findCommand = (
	name: string,
	restricted: boolean = false
): BaseCommand | null => {
	return (
		commands.filter(
			command =>
				command.name === name &&
				(command.restricted === restricted || restricted === null)
		)[0] || null
	)
}

export const autocompleteCommand = (startCommand: string): string => {
	if (startCommand === "") return ""

	const find = commands.filter(
		command => !command.restricted && command.name.indexOf(startCommand) === 0
	)
	if ((find[0]?.name || "").length === startCommand.length) return ""
	return find[0]?.name || ""
}
