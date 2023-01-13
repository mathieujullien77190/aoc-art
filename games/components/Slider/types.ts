/** @format */

export type SliderProps = {
	label: string
	max: number
	value?: number
	min?: number
	loop?: boolean
	step?: number
	bigStep?: number
	unit?: string

	onChange?: ({ value, diff }: { value: number; diff: number }) => void
}
