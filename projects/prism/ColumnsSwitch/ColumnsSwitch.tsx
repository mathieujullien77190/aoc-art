/** @format */

import Toggle from "../ui/Toggle"
import { ASCII_COLS_OPTIONS, LABEL_ASCII_COLS } from "../constants"
import { ColumnsSwitchProps } from "./types"

// Toggle travaille sur des chaines : conversion aux extremites
const options = ASCII_COLS_OPTIONS.map(cols => ({
	value: String(cols),
	label: String(cols),
}))

export const ColumnsSwitch = ({
	value,
	onChange = () => {},
	disabled = false,
}: ColumnsSwitchProps) => (
	<Toggle
		label={LABEL_ASCII_COLS}
		options={options}
		value={String(value)}
		onChange={next => onChange(Number(next))}
		disabled={disabled}
	/>
)
