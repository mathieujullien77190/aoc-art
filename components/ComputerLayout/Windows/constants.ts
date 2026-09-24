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
 * Desktop icons, in display order. The shell, 1/PRISM and the docs open a
 * window; AOC and the CV play a command in the shell.
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
		key: "game",
		label: { fr: "Tic-Tac-Tic", en: "Tic-Tac-Tic" },
		image: "🎮",
	},
	{
		key: "azimut",
		label: { fr: "Azimut Quiz", en: "Azimut Quiz" },
		image: "🧭",
	},
	{
		key: "cv",
		label: "CV",
		image: "📄",
		corner: true,
		command: "cv",
	},
]

// below this, windows stay full and not resizable
export const COMPACT_MAX_WIDTH = 1024

/**
 * The windows, in order: it drives the cascade offset on opening and the
 * taskbar order.
 */
export const WINDOW_NAMES: WindowName[] = [
	"shell",
	"prism",
	"storybook",
	"game",
	"azimut",
]
