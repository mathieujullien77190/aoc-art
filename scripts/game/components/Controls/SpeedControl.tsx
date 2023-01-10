/** @format */

import { SpeedControlProps } from "./types"

import Slider from "../Slider"

export const SpeedControl = ({
	value,
	min = 0,
	max = 1000,
	onChange,
}: SpeedControlProps) => {
	return (
		<Slider
			label="Vitesse"
			min={min}
			max={max}
			step={(max - min) / 50}
			bigStep={(max - min) / 10}
			value={value}
			onChange={({ value }) => {
				onChange(value)
			}}
		/>
	)
}
