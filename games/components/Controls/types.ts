/** @format */
import { SliderProps } from "../Slider"

export type SpeedControlProps = {
	value: number
	min: number
	max: number
	onChange: (value: number) => void
}

export type DataControlProps = {
	value: number
	min: number
	max: number
	onChange: (value: number) => void
}

export type ResetControlProps = { onChange: () => void }

export type ReloadControlProps = { onChange: (value: number) => void }

export type RotationControlProps = {
	value: number
	type: "H" | "V"
	onChange: ({ value, diff }: { value: number; diff: number }) => void
}

export type CustomSliderControlProps = SliderProps

export type ZoomControlProps = {
	value: number
	min: number
	max: number
	onChange: (value: number) => void
}

export type Controls =
	| ({ name: "slider" } & SliderProps)
	| { name: "speed"; value: number; min: number; max: number }
	| { name: "data"; value: number; min: number; max: number }
	| { name: "zoom"; value: number; min: number; max: number }
	| { name: "rotation"; value: number; type: "H" | "V" }
	| { name: "help" }
	| { name: "reset" }
	| { name: "reload" }

export type ControllerProps = {
	controls: Controls[]
	children?: JSX.Element
	onChange: (name: string, value: unknown) => void
}
