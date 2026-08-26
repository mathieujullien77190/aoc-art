import type { JSX } from "react"

export type ComputerProps = {
	children: JSX.Element
	/** joue une commande dans le terminal */
	onRunCommand?: (pattern: string) => void
	onCloseWindow?: () => void
}
