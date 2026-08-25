/** @format */

import Toggle from "../ui/Toggle"
import {
	HIGHLIGHT_FILLS,
	HIGHLIGHT_FILL_LABELS,
	LABEL_HIGHLIGHT_FILL,
} from "../constants"
import { HighlightFill } from "../types"
import { HighlightFillSwitchProps } from "./types"

const options = HIGHLIGHT_FILLS.map(fill => ({
	value: fill,
	label: HIGHLIGHT_FILL_LABELS[fill],
}))

export const HighlightFillSwitch = ({
	value,
	onChange = () => {},
	disabled = false,
}: HighlightFillSwitchProps) => (
	<Toggle
		label={LABEL_HIGHLIGHT_FILL}
		options={options}
		value={value}
		onChange={next => onChange(next as HighlightFill)}
		disabled={disabled}
	/>
)
