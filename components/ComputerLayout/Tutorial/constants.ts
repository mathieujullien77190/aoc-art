import { Translatable } from "_/types"
import { Step } from "./types"

/** marge entre le contour du projecteur et l'element vise, en pixels */
export const PADDING = 6

/** gabarit de la bulle : la largeur se reduit sur un petit ecran */
export const BOX_WIDTH = 340
export const BOX_MARGIN = 12

/**
 * Hauteur supposee de la bulle, pour choisir entre dessus et dessous
 * avant de l'avoir rendue. La mesurer imposerait un effet et un second
 * rendu a chaque etape pour un placement identique.
 */
export const BOX_HEIGHT = 170

export const NEXT: Translatable = { fr: "Suivant", en: "Next" }
export const QUIT: Translatable = { fr: "Quitter", en: "Quit" }

export const STEPS: Step[] = [
	{
		target: "cmd-welcome",
		// le visiteur a pu effacer l'accueil avec clear
		fallback: "input",
		title: { fr: "Le shell", en: "The shell" },
		text: {
			fr: "Tout se passe ici : tapez une commande puis appuyez sur [ENTREE].",
			en: "Everything happens here: type a command then press [ENTER].",
		},
		awaitCommand: "help",
	},
	{
		target: "input",
		title: { fr: "La saisie", en: "The prompt" },
		text: {
			fr: "[TAB] complete la commande commencée, les fleches [HAUT] et [BAS] rejouent l'historique.",
			en: "[TAB] completes the command you started, [UP] and [DOWN] replay the history.",
		},
	},
	{
		target: "cmd-help",
		title: { fr: "L'aide", en: "Help" },
		text: {
			fr: "Tapez `help` puis [ENTREE] pour voir la liste des commandes.",
			en: "Type `help` then [ENTER] to see the list of commands.",
		},
	},
	{
		target: "input",
		title: { fr: "Les puzzles", en: "The puzzles" },
		text: {
			fr: "Tapez `aoc list` pour la liste des puzzles AOC, puis `aoc 5` pour lancer l'animation.",
			en: "Type `aoc list` for the list of AOC puzzles, then `aoc 5` to run the animation.",
		},
		awaitCommand: "aoc",
	},
	{
		target: "icon-cv",
		title: { fr: "Le bureau", en: "The desktop" },
		text: {
			fr: "Les icônes ouvrent des projets particuliers, mais vous pouvez aussi utiliser une commande.",
			en: "The icons open specific projects, but you can also use a command.",
		},
	},
	{
		target: "titlebar-shell",
		title: { fr: "La fenetre", en: "The window" },
		text: {
			fr: "Glissez la fenetre par sa barre de titre, double-cliquez pour l'agrandir.",
			en: "Drag the window by its title bar, double-click to make it full size.",
		},
	},
	{
		target: "icon-help",
		title: { fr: "C'est tout", en: "That's it" },
		text: {
			fr: "Cette icone rejoue le tutorial, la commande `tuto` aussi.",
			en: "This icon replays the tutorial, the `tuto` command too.",
		},
	},
]
