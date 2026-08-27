import { BaseCommand, Translatable, shellActions } from "retro-shell"

import { colors, app } from "_components/constants"

import { title, highlightFlower } from "./asciArt"
import { displayList, loadScript, getScript } from "./aocCommands"
import { CV_SECTIONS, buildCV } from "./cv"

import { Games } from "_games/Games"
import { gamesConfig } from "_games/constants"

import { globalActions } from "_store/global/"

const RESTRICTED: Translatable = {
	fr: "Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
	en: "This is a restricted command, you cannot use it",
}

/** les commandes propres a ce site ; les autres viennent du paquet */
export const commands: BaseCommand[] = [
	{
		restricted: true,
		name: "welcome",
		action: () => ({
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
		restricted: false,
		name: "aoc",
		action: ({ args }) => {
			if (args[0] === "list" || args.length === 0) {
				return displayList(gamesConfig)
			} else {
				return loadScript(args, gamesConfig)
			}
		},
		effect: ({ args }) => {
			if (getScript(args, gamesConfig))
				shellActions().setKeyboardOnFocus(false)
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
					pattern: "aoc list",
					description: {
						fr: "Liste tout les scripts",
						en: "Lists every script",
					},
				},
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
		effect: () => shellActions().setKeyboardOnFocus(true),
		help: { description: RESTRICTED, patterns: [] },
	},
	{
		restricted: false,
		name: "cv",
		testArgs: { authorize: CV_SECTIONS, empty: true },
		action: ({ args }) => buildCV(args[0]),
		help: {
			description: {
				fr: "Affiche le CV de l'auteur, en entier ou par section",
				en: "Shows the author's resume, whole or section by section",
			},
			patterns: [
				{
					pattern: "cv",
					description: {
						fr: "Affiche le CV complet",
						en: "Shows the whole resume",
					},
				},
				{
					pattern: `cv [${CV_SECTIONS.join(" | ")}]`,
					description: {
						fr: "+cv xp+ => Affiche uniquement les expériences",
						en: "+cv xp+ => shows the experience section only",
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
		name: "stux",
		action: () => ({
			fr: "en cours...",
			en: "in progress...",
		}),
		// le calque est monte une fois pour toutes par la page : le rendre
		// ici en poserait un par ligne de commande, et deux calques se
		// disputeraient le masque de la fenetre
		effect: () => globalActions().setProperty("virus", Date.now()),
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
		name: "prism",
		action: () => ({
			fr: "ouverture de 1/PRISM",
			en: "opening 1/PRISM",
		}),
		// le bureau lit la pile des fenetres dans le store
		effect: () => globalActions().focusWindow("prism"),
		help: {
			patterns: [
				{
					pattern: "prism",
					description: {
						fr: "Ouvre 1/PRISM, les flux de caméras rendus en ASCII",
						en: "Opens 1/PRISM, camera feeds rendered as ASCII",
					},
				},
			],
		},
	},
	{
		restricted: false,
		name: "tuto",
		action: () => ({
			fr: "visite guidée",
			en: "guided tour",
		}),
		// la visite lit le drapeau dans le store, comme le bureau
		effect: () => globalActions().setProperty("tutorial", true),
		help: {
			patterns: [
				{
					pattern: "tuto",
					description: {
						fr: "Rejoue la visite guidée du bureau et du shell",
						en: "Replays the guided tour of the desktop and the shell",
					},
				},
			],
		},
	},
]
