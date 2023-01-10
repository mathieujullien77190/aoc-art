/** @format */

import { RotationControlProps } from "./types"

import Slider from "../Slider"

export const RotationControl = ({
	value,
	type,
	onChange,
}: RotationControlProps) => {
	return (
		<Slider
			label={type === "H" ? "Rotation horyzontal" : "RotationVertical"}
			min={0}
			max={360}
			loop
			step={10}
			bigStep={90}
			unit="°"
			value={value}
			onChange={onChange}
		/>
	)
}
