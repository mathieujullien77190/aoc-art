import type { JSX } from "react"

import { Translatable } from "_i18n"

export type WindowsProps = {
	/** force ignores the BIOS setting: the virus takes the machine down anyway */
	onBlueScreen?: (force?: boolean) => void
	/** plays a command in the terminal */
	onRunCommand?: (pattern: string) => void
	onCloseWindow?: () => void
	children: JSX.Element
}

export type Pos = { x: number; y: number }

/** icon that carries a desktop window */
export type WindowName = "shell" | "prism" | "storybook" | "game" | "azimut"

/** AOC and the CV open no window: they play a command */
export type IconKey = WindowName | "aoc" | "cv"

export type DesktopIcon = {
	key: IconKey
	/** label under the icon, and in the taskbar */
	label: Translatable
	image: string
	/** placed at the top right, outside the desktop column */
	corner?: boolean
	/**
	 * The line it plays in the shell. An icon that plays a command opens
	 * nothing: it does not stay lit.
	 */
	command?: string
}
