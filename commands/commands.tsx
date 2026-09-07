import { BaseCommands } from "flower-shell"

import { Translatable, say } from "_i18n"

import { app } from "_components/constants"

import { displayList, loadScript, getScript } from "./aocCommands"
import { CV_SECTIONS, buildCV } from "./cv"

import { Games } from "_games/Games"
import { gamesConfig } from "_games/constants"

import { globalActions } from "_store/global/"
import { shellState } from "_store/shell/"

const RESTRICTED: Translatable = {
	fr: "Ceci est une commande à accès restreint, vous ne pouvez pas l'utiliser",
	en: "This is a restricted command, you cannot use it",
}

/**
 * Les commandes propres a ce site ; les autres viennent du paquet.
 *
 * Le nom n'est plus dans la commande, c'est la cle qui le porte. Et les
 * textes sont resolus a l'affichage, pas a la definition : le paquet lit
 * l'aide au moment de la rendre, la langue a pu changer entre-temps.
 */
export const commands: BaseCommands = {
	aoc: {
		restricted: false,
		action: ({ args }) => {
			if (args[0] === "list" || args.length === 0) {
				return displayList(gamesConfig)
			} else {
				return say(loadScript(args, gamesConfig))
			}
		},
		effect: ({ args }) => {
			if (getScript(args, gamesConfig))
				shellState()?.setKeyboardOnFocus(false)
		},

		JSX: ({ args }) => {
			const script = getScript(args, gamesConfig)

			return script ? <Games day={script.day} year={script.year} /> : <></>
		},

		help: () => ({
			description: say({
				fr: "Affiche l'exercice du jour En ASCII Art ",
				en: "Displays the day's puzzle as ASCII art",
			}),
			patterns: [
				{
					pattern: "aoc list",
					description: say({
						fr: "Liste tout les scripts",
						en: "Lists every script",
					}),
				},
				{
					pattern: "aoc [index]",
					description: say({
						fr: '+aoc 1+ => Lancera "Calorie Counting"',
						en: '+aoc 1+ => runs "Calorie Counting"',
					}),
				},
				{
					pattern: "aoc [year]-[date]",
					description: say({
						fr: '+aoc 2022-12+ => Lancera "Hill Climbing Algorithm"',
						en: '+aoc 2022-12+ => runs "Hill Climbing Algorithm"',
					}),
				},
				{
					pattern: "aoc [string]",
					description: say({
						fr: '+aoc cuc+ => Lancera "Sea Cucumber"',
						en: '+aoc cuc+ => runs "Sea Cucumber"',
					}),
				},
			],
		}),
		display: {
			animation: false,
		},
	},

	closeaoc: {
		restricted: true,
		action: () => {
			return "script close"
		},
		effect: () => shellState()?.setKeyboardOnFocus(true),
		help: () => ({ description: say(RESTRICTED), patterns: [] }),
	},

	cv: {
		restricted: false,
		testArgs: { authorize: CV_SECTIONS, empty: true },
		action: ({ args }) => say(buildCV(args[0])),
		help: () => ({
			description: say({
				fr: "Affiche le CV de l'auteur, en entier ou par section",
				en: "Shows the author's resume, whole or section by section",
			}),
			patterns: [
				{
					pattern: "cv",
					description: say({
						fr: "Affiche le CV complet",
						en: "Shows the whole resume",
					}),
				},
				{
					pattern: `cv [${CV_SECTIONS.join(" | ")}]`,
					description: say({
						fr: "+cv xp+ => Affiche uniquement les expériences",
						en: "+cv xp+ => shows the experience section only",
					}),
				},
			],
		}),
	},

	about: {
		restricted: false,
		action: () =>
			say({
				fr: [
					`\n| $${app.name}$`,
					`| Créée par §${app.author}§ alias §${app.alias}§ `,
					"| Technos utilisées : React | NextJs | NodeJs | TypeScript",
				].join("\n"),
				en: [
					`\n| $${app.name}$`,
					`| Created by §${app.author}§ aka §${app.alias}§ `,
					"| Built with : React | NextJs | NodeJs | TypeScript",
				].join("\n"),
			}),

		help: () => ({
			patterns: [
				{
					pattern: "about",
					description: say({
						fr: "Affiche différentes informations inutile",
						en: "Shows assorted useless information",
					}),
				},
			],
		}),
	},

	stux: {
		restricted: false,
		action: () =>
			say({
				fr: "en cours...",
				en: "in progress...",
			}),
		// le calque est monte une fois pour toutes par la page : le rendre
		// ici en poserait un par ligne de commande, et deux calques se
		// disputeraient le masque de la fenetre
		effect: () => globalActions().setProperty("virus", Date.now()),
		help: () => ({
			patterns: [
				{
					pattern: "stux",
					description: say({
						fr: "fonctionnalité expérimentale et inutile",
						en: "experimental and useless feature",
					}),
				},
			],
		}),
	},

	prism: {
		restricted: false,
		action: () =>
			say({
				fr: "ouverture de 1/PRISM",
				en: "opening 1/PRISM",
			}),
		// le bureau lit la pile des fenetres dans le store
		effect: () => globalActions().focusWindow("prism"),
		help: () => ({
			patterns: [
				{
					pattern: "prism",
					description: say({
						fr: "Ouvre 1/PRISM, les flux de caméras rendus en ASCII",
						en: "Opens 1/PRISM, camera feeds rendered as ASCII",
					}),
				},
			],
		}),
	},

	tuto: {
		restricted: false,
		action: () =>
			say({
				fr: "visite guidée",
				en: "guided tour",
			}),
		// la visite lit le drapeau dans le store, comme le bureau
		effect: () => globalActions().setProperty("tutorial", true),
		help: () => ({
			patterns: [
				{
					pattern: "tuto",
					description: say({
						fr: "Rejoue la visite guidée du bureau et du shell",
						en: "Replays the guided tour of the desktop and the shell",
					}),
				},
			],
		}),
	},
}
