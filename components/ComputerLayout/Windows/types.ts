import type { JSX } from "react"

import { Translatable } from "retro-shell"

export type WindowsProps = {
	/** force ignore le reglage BIOS : le PDF plante la machine quoi qu'il arrive */
	onBlueScreen?: (force?: boolean) => void
	/** joue une commande dans le terminal */
	onRunCommand?: (pattern: string) => void
	onCloseWindow?: () => void
	children: JSX.Element
}

export type Pos = { x: number; y: number }

/** icone qui porte une fenetre du bureau */
export type WindowName = "shell" | "prism"

/** les deux dernieres icones n'ouvrent pas de fenetre */
export type IconKey = WindowName | "cv" | "help"

export type DesktopIcon = {
	key: IconKey
	/** libelle sous l'icone, et dans la barre des taches */
	label: Translatable
	image: string
	/** marque visee par la visite guidee */
	tutorial?: string
}
