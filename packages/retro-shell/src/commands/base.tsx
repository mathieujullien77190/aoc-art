import { BaseCommand, Help, Translatable } from "../types"
import { FLOWER_LANG, LANGS, pick } from "../i18n/lang"
import { colors } from "../theme"
import { shellActions } from "../state/store"
import { highlightFlower, plantFlowers } from "./flowers"

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

/**
 * L'aide est assemblee avant d'atteindre la traduction : on produit donc
 * les deux variantes ici, sinon le texte final serait fige dans une seule
 * langue.
 */
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

const commandHelp = (commands: BaseCommand[], name: string): Help | null =>
	commands.filter(command => command.name === name)[0]?.help || null

/**
 * Les commandes fournies avec le shell. Les deux dernieres sont
 * restreintes et cherchees par nom par le moteur : les retirer casserait
 * le rendu d'une commande inconnue.
 */
export const baseCommands: BaseCommand[] = [
	{
		restricted: false,
		name: "help",
		action: ({ args, commands }) => {
			if (args.length === 0) {
				const all = allCommandsHelp(commands)
				return { fr: `\n${all.fr}`, en: `\n${all.en}` }
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
				fr: "Fournit des informations d’aide sur les commandes",
				en: "Provides help about the commands",
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
		name: "clear",
		action: () => "",
		// l'historique est vide, mais la banniere est rejouee juste apres
		effect: () => shellActions().clear(),
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
		name: "hello",
		action: ({ args }) =>
			args.length === 0
				? { fr: "Hello le monde", en: "Hello world" }
				: `Hello ${args.join(" ")}`,
		help: {
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
		name: "flowers",
		action: () => plantFlowers(),
		display: {
			stylePre: {
				fontSize: "calc(100cqw/60)",
				color: colors().appColor,
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
						fr: "🌼🌼🌼 Plantez des fleurs 🌼🌼🌼",
						en: "🌼🌼🌼 Plant some flowers 🌼🌼🌼",
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
		effect: ({ args }) => shellActions().setAnimation(args[0] === "on"),
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
		name: "lang",
		testArgs: { authorize: LANGS, empty: false },
		action: ({ args }) => ({
			fr: `langage : ${args[0]}`,
			en: `language: ${args[0]}`,
		}),
		effect: ({ args }) => shellActions().setLang(args[0]),
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
					pattern: `lang ${FLOWER_LANG}`,
					description: {
						fr: "Change chaque lettre en fleur (version inutile)",
						en: "Turns every letter into a flower (useless version)",
					},
				},
			],
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
]

export { RESTRICTED }
