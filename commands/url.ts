import type { CommandEvent } from "flower-shell"

import { gamesConfig } from "_games/constants"

import { getScript } from "./aocCommands"
import { isRoute, routePath } from "./routes"

/** Lines the shell plays for itself: they say nothing about the page */
const SYSTEM_LINES = ["title", "welcome", "unknow", "argumenterror", "actionmap"]

/** `aoc` maps to the script index, whatever was typed: `aoc 2022-1` is /aoc/1 */
const segmentsOf = ({ name, args }: CommandEvent): string[] => {
	if (name === "aoc" && args.length > 0) {
		const script = getScript(args, gamesConfig)

		if (script) return ["aoc", String(gamesConfig.indexOf(script))]
	}

	return [name, ...args]
}

/**
 * Mirrors the last played command in the URL (`aoc 5` gives /aoc/5, or /
 * when the line has no page). replaceState, not pushState: no history
 * entry per command.
 */
export const syncUrl = (event: CommandEvent) => {
	if (SYSTEM_LINES.includes(event.name)) return

	const segments = segmentsOf(event)
	const path = isRoute(segments) ? routePath(segments) : "/"

	if (location.pathname !== path) history.replaceState(null, "", path)
}
