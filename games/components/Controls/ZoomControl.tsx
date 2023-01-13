/** @format */

import { ZoomControlProps } from "./types"

import Slider from "_games/components/Slider"

export const ZoomControl = ({
	value,
	min,
	max,
	onChange,
}: ZoomControlProps) => {
	return (
		<Slider
			label="Zoom"
			min={min}
			max={max}
			step={1}
			bigStep={5}
			unit=""
			value={value}
			onChange={({ value }) => onChange(value)}
		/>
	)
}
