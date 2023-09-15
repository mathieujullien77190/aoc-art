/** @format */

export type TitleDayProps = {
	year: string
	day: string
	title: string
	AOCUrl: string
	special: boolean
	onClose?: () => void
	onFuck?: () => void
}

export type CloseStyles = {
	left?: string
	right?: string
	top?: string
	bottom?: string
}
