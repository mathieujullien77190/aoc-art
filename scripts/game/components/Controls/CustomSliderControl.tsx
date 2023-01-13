/** @format */

import { CustomSliderControlProps } from "./types"

import Slider from "../Slider"

export const CustomSliderControl = ({
	label,
	min,
	max,
	step,
	bigStep,
	unit,
	value,
	onChange,
}: CustomSliderControlProps) => {
	return (
		<Slider
			label={label}
			min={min}
			max={max}
			step={step}
			bigStep={bigStep}
			unit={unit}
			value={value}
			onChange={onChange}
		/>
	)
}
