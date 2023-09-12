/** @format */

export type Pos = { x: number; y: number }
export type AlertProps = {
	pos: Pos
	message: string
	show: boolean
	onOk?: () => void
	onCancel?: () => void
	onClose?: () => void
}
