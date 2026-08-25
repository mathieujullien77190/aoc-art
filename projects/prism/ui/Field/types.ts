/** @format */

export type FieldProps = {
	label: string
	value: string
	type?: "text" | "number" | "color"
	min?: number
	max?: number
	onChange?: (value: string) => void
	onBlur?: () => void
}
