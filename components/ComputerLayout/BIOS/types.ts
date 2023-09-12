/** @format */

export type BIOSProps = { onExit?: () => void }

export type ItemProps = {
	num: number
	current: number
	label: string
	children: JSX.Element
}

export type Item = {
	label: string
	id: number
	content: (
		item: Item,
		current: number,
		value: string | undefined,
		onChange: (value: string) => void
	) => JSX.Element
	choices: any
	message: string
}

export type ChoicesProps = {
	currentItem: Item
	current: number
	value: string
	onChange?: (value: string) => void
}
