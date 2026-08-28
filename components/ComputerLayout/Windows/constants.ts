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
 * Les icones du bureau, dans l'ordre d'affichage. Les deux premieres
 * ouvrent une fenetre, la troisieme une boite de dialogue, la derniere
 * la visite guidee.
 */
export const ICONS: DesktopIcon[] = [
	{ key: "shell", label: "Flower Shell", image: "🌼" },
	{ key: "prism", label: "1/PRISM", image: "📡" },
	{ key: "cv", label: "CV", image: "💼", tutorial: "icon-cv" },
	{
		key: "help",
		label: { fr: "Aide", en: "Help" },
		image: "💡",
		tutorial: "icon-help",
	},
]

// en dessous, les fenetres restent pleines et non redimensionnables
export const COMPACT_MAX_WIDTH = 1024

/**
 * Les fenetres, dans l'ordre : il sert au decalage en cascade a
 * l'ouverture et a l'ordre de la barre des taches.
 */
export const WINDOW_NAMES: WindowName[] = ["shell", "prism"]
