/** @format */

export type ToggleOption = {
	value: string
	label: string
}

export type ToggleProps = {
	label: string
	options: ToggleOption[]
	value: string
	onChange?: (value: string) => void
	disabled?: boolean
}
