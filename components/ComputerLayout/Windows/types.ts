/** @format */

export type WindowsProps = {
	onBlueScreen?: () => void
	onCloseWindow?: () => void
	children: JSX.Element
}

export type Pos = { x: number; y: number }
