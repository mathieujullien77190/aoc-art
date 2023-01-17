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

export type ResetControlProps = { onChange: () => void; label: string }

export type ReloadControlProps = { onChange: (value: number) => void }

export type AnimationValue = { speed: number; reload: number; pause: boolean }

export type AnimationControlProps = {
	onChange: (value: AnimationValue) => void
	speed?: number
	reload?: number
	pause?: boolean
}

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
	| { name: "reset"; label: string }
	| { name: "reload" }
	| {
			name: "animation"
			speed?: number
			reload?: number
			pause?: boolean
	  }
	| { name: "separator" }

export type ControllerProps = {
	controls: Controls[]
	children?: JSX.Element
	onChange: (name: string, value: unknown) => void
}
