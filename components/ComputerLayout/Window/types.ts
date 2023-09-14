/** @format */

import { RefObject } from "react"

export type Pos = { x: number; y: number }
export type Size = { width: number; height: number; unit: "px" | "%" }
export type Mode = "medium" | "full" | "close"

export type WindowProps = {
	show: boolean
	container: RefObject<HTMLDivElement>
	title?: string
	children: JSX.Element
	onClose?: () => void
}
