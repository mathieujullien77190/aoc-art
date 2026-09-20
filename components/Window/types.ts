import { ReactNode, RefObject } from "react"

export type Pos = { x: number; y: number }
export type Mode = "medium" | "full" | "close"

export type WindowProps = {
	show: boolean
	container: RefObject<HTMLDivElement>
	title?: string
	/** mark of the whole frame, to put a layer over it */
	mark?: string
	/**
	 * Enlarge rank: each increment opens the window large. A boolean would
	 * only work once, since the visitor can shrink it afterwards.
	 */
	expand?: number
	/** stacking level: the front window has the highest */
	layer?: number
	/** rank in the cascade, so it does not open on the previous one */
	rank?: number
	/** height reserved at the bottom, in CSS: the desktop puts its taskbar there */
	bottomInset?: string
	/**
	 * Full and not resizable. Up to whoever shows it to decide when: small
	 * screen, reading mode, a preference. The package sets no threshold.
	 */
	compact?: boolean
	/**
	 * Fixed portrait template instead of the usual medium square, for content
	 * made for a phone screen. Not resizable, like `compact`; `compact` wins
	 * on small screens.
	 */
	phone?: boolean
	/**
	 * The content carries its own frame: the window leaves it all the room
	 * between its borders, with no margin or background. That is the shell's
	 * case, whose theme sets its own margin and background.
	 */
	flush?: boolean
	/** the window asks for the front */
	onFocus?: () => void
	children: ReactNode
	onClose?: () => void
}
