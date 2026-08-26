import Slider from "../ui/Slider"
import { LABEL_TOLERANCE, TOLERANCE_MAX, TOLERANCE_MIN } from "../constants"
import { ToleranceSliderProps } from "./types"

export const ToleranceSlider = ({
	value,
	onChange = () => {},
	disabled = false,
}: ToleranceSliderProps) => (
	<Slider
		label={LABEL_TOLERANCE}
		value={value}
		min={TOLERANCE_MIN}
		max={TOLERANCE_MAX}
		display={`${value}°`}
		onChange={onChange}
		disabled={disabled}
	/>
)
