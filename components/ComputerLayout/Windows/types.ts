import type { JSX } from "react"

export type WindowsProps = {
	/** force ignore le reglage BIOS : le PDF plante la machine quoi qu'il arrive */
	onBlueScreen?: (force?: boolean) => void
	/** joue une commande dans le terminal */
	onRunCommand?: (pattern: string) => void
	onCloseWindow?: () => void
	children: JSX.Element
}

export type Pos = { x: number; y: number }
