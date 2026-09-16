import type { JSX } from "react"

import { Translatable } from "_i18n"

export type WindowsProps = {
	/** force ignore le reglage BIOS : le virus emporte la machine de toute facon */
	onBlueScreen?: (force?: boolean) => void
	/** joue une commande dans le terminal */
	onRunCommand?: (pattern: string) => void
	onCloseWindow?: () => void
	children: JSX.Element
}

export type Pos = { x: number; y: number }

/** icone qui porte une fenetre du bureau */
export type WindowName = "shell" | "prism" | "storybook" | "game"

/** AOC et le CV n'ouvrent pas de fenetre : ils jouent une commande */
export type IconKey = WindowName | "aoc" | "cv"

export type DesktopIcon = {
	key: IconKey
	/** libelle sous l'icone, et dans la barre des taches */
	label: Translatable
	image: string
	/** posee en haut a droite, hors de la colonne du bureau */
	corner?: boolean
	/**
	 * La ligne qu'elle joue dans le shell. Une icone qui joue une commande
	 * n'ouvre rien : elle ne reste pas allumee.
	 */
	command?: string
}
