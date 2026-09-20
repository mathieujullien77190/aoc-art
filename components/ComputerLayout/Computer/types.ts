import type { JSX } from "react"

export type ComputerProps = {
	children: JSX.Element
	/** plays a command in the terminal */
	onRunCommand?: (pattern: string) => void
	onCloseWindow?: () => void
}
