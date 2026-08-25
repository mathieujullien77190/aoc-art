/** @format */

import Toggle from "../ui/Toggle"
import { LABEL_MODE, MODES, MODE_LABELS } from "../constants"
import { FeedMode } from "../types"
import { ModeSwitchProps } from "./types"

const options = MODES.map(mode => ({
	value: mode,
	label: MODE_LABELS[mode],
}))

export const ModeSwitch = ({ value, onChange = () => {} }: ModeSwitchProps) => (
	<Toggle
		label={LABEL_MODE}
		options={options}
		value={value}
		onChange={next => onChange(next as FeedMode)}
	/>
)
