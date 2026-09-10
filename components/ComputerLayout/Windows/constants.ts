import { DesktopIcon, WindowName } from "./types"

export const FULL = {
	heightBar: "30px",
	padding: "12px",
	borderSize: "2px",
}

export const COLORS = {
	text: "#000000",
	border: "#000000",
	bar: "#f2e7c8",
}

/**
 * Les icones du bureau, dans l'ordre d'affichage. Le shell, 1/PRISM et la
 * doc ouvrent une fenetre, AOC et le CV jouent une commande dans le shell.
 */
export const ICONS: DesktopIcon[] = [
	{ key: "shell", label: "Flower Shell", image: "🌼" },
	{ key: "aoc", label: "Advent of Code", image: "🎄", command: "aoc list" },
	{ key: "prism", label: "1/PRISM", image: "📡" },
	{
		key: "storybook",
		label: { fr: "Doc Flower Shell", en: "Flower Shell docs" },
		image: "📖",
	},
	{
		key: "cv",
		label: "CV",
		image: "📄",
		corner: true,
		command: "cv",
	},
]

// en dessous, les fenetres restent pleines et non redimensionnables
export const COMPACT_MAX_WIDTH = 1024

/**
 * Les fenetres, dans l'ordre : il sert au decalage en cascade a
 * l'ouverture et a l'ordre de la barre des taches.
 */
export const WINDOW_NAMES: WindowName[] = ["shell", "prism", "storybook"]
