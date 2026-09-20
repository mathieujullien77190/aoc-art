import { gamesMeta } from "_games/meta"

import { CV_SECTIONS } from "./cv"

/**
 * Les pages statiques du site : une ligne de commande = un chemin, ses mots
 * separes par des /. `aoc 5` est /aoc/5, `cv xp` est /cv/xp.
 *
 * Donnees pures, sans le shell ni ses composants : generateStaticParams les
 * lit cote serveur, ou flower-shell et styled-components ne passent pas.
 * L'export statique veut ses pages connues au build, donc seules les lignes
 * listees ici ont une adresse ; les autres laissent l'URL a l'accueil.
 *
 * Absentes a dessein : `clear` (rien a rejouer), `cv pdf` et `flower-shell
 * git|storybook` (ouvrent un onglet, qu'un chargement de page se ferait
 * bloquer), et les arguments libres (theme, font, `aoc cuc`...).
 */

/** les commandes du paquet flower-shell, hors clear et test */
const BASE_COMMANDS = [
	"animation",
	"flowers",
	"font",
	"hello",
	"help",
	"lang",
	"theme",
]

/** les commandes de ce site, hors closeaoc qui est restreinte */
const SITE_COMMANDS = ["aoc", "cv", "about", "stux", "prism", "ttt", "flower-shell"]

const COMMANDS = [...BASE_COMMANDS, ...SITE_COMMANDS]

export const ROUTES: string[][] = [
	...COMMANDS.map(name => [name]),
	...COMMANDS.map(name => ["help", name]),
	["aoc", "list"],
	// l'index dans la liste, tel que `aoc 5` le designe
	...gamesMeta.map((_, index) => ["aoc", String(index)]),
	...CV_SECTIONS.map(section => ["cv", section]),
]

export const isRoute = (segments: string[]): boolean =>
	ROUTES.some(
		route =>
			route.length === segments.length &&
			route.every((segment, index) => segment === segments[index])
	)

/** avec le / final : le site est exporte en trailingSlash */
export const routePath = (segments: string[]): string =>
	`/${segments.join("/")}/`
