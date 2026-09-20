import type { CommandEvent } from "flower-shell"

import { gamesConfig } from "_games/constants"

import { getScript } from "./aocCommands"
import { isRoute, routePath } from "./routes"

/** les lignes que le shell se joue a lui-meme : elles ne disent rien de la page */
const SYSTEM_LINES = ["title", "welcome", "unknow", "argumenterror", "actionmap"]

/**
 * Les mots de la ligne jouee. `aoc` passe par l'index du script quelle que
 * soit la forme tapee : `aoc 2022-1` et `aoc calorie` font tous /aoc/1.
 */
const segmentsOf = ({ name, args }: CommandEvent): string[] => {
	if (name === "aoc" && args.length > 0) {
		const script = getScript(args, gamesConfig)

		if (script) return ["aoc", String(gamesConfig.indexOf(script))]
	}

	return [name, ...args]
}

/**
 * L'URL suit la derniere commande jouee : /aoc/5 pour `aoc 5`, / quand la
 * ligne n'a pas de page (clear, closeaoc, arguments libres). replaceState et
 * non pushState : pas d'entree d'historique par commande, et Next relaie
 * l'appel a son routeur sans rien remonter.
 */
export const syncUrl = (event: CommandEvent) => {
	if (SYSTEM_LINES.includes(event.name)) return

	const segments = segmentsOf(event)
	const path = isRoute(segments) ? routePath(segments) : "/"

	if (location.pathname !== path) history.replaceState(null, "", path)
}
