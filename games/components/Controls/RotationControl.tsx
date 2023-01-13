/** @format */

import { RotationControlProps } from "./types"

import Slider from "_games/components/Slider"

export const RotationControl = ({
	value,
	type,
	onChange,
}: RotationControlProps) => {
	return (
		<Slider
			label={type === "H" ? "Rotation horyzontal" : "Rotation vertical"}
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
