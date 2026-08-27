import type { JSX } from "react"

import { RefObject } from "react"

export type Pos = { x: number; y: number }
export type Mode = "medium" | "full" | "close"

export type WindowProps = {
	show: boolean
	container: RefObject<HTMLDivElement>
	title?: string
	/** etage d'empilement : la fenetre au premier plan a le plus grand */
	layer?: number
	/** rang dans la cascade, pour ne pas s'ouvrir sur la precedente */
	rank?: number
	/** la fenetre reclame le premier plan */
	onFocus?: () => void
	children: JSX.Element
	onClose?: () => void
}
