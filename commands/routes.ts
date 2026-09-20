import { gamesMeta } from "_games/meta"

import { CV_SECTIONS } from "./cv"

/**
 * Static pages: one command line, one path (`aoc 5` is /aoc/5). Plain data,
 * because flower-shell and styled-components cannot load in a server
 * component, and the static export needs its pages known at build time.
 *
 * Left out on purpose: `clear`, `cv pdf` and `flower-shell git|storybook`
 * (they open a tab, which a page load would get blocked) and free-form
 * arguments.
 */

/** flower-shell commands, minus clear and test */
const BASE_COMMANDS = [
	"animation",
	"flowers",
	"font",
	"hello",
	"help",
	"lang",
	"theme",
]

/** this site's commands, minus the restricted closeaoc */
const SITE_COMMANDS = ["aoc", "cv", "about", "stux", "prism", "ttt", "flower-shell"]

const COMMANDS = [...BASE_COMMANDS, ...SITE_COMMANDS]

export const ROUTES: string[][] = [
	...COMMANDS.map(name => [name]),
	...COMMANDS.map(name => ["help", name]),
	["aoc", "list"],
	// list index, as in `aoc 5`
	...gamesMeta.map((_, index) => ["aoc", String(index)]),
	...CV_SECTIONS.map(section => ["cv", section]),
]

export const isRoute = (segments: string[]): boolean =>
	ROUTES.some(
		route =>
			route.length === segments.length &&
			route.every((segment, index) => segment === segments[index])
	)

/** with the trailing slash: the site is exported with trailingSlash */
export const routePath = (segments: string[]): string =>
	`/${segments.join("/")}/`
