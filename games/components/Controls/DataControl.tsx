import { DataControlProps } from "./types"

import Slider from "../Slider"

export const DataControl = ({
	value,
	min = 0,
	max = 1000,
	onChange,
}: DataControlProps) => {
	return (
		<Slider
			label="Taille des données"
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
