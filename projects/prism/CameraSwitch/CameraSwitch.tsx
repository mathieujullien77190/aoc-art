import Toggle from "../ui/Toggle"
import { CAMERAS, LABEL_CAMERA_SOURCE } from "../constants"
import { CameraSwitchProps } from "./types"

// Toggle travaille sur des chaines : conversion aux extremites
const options = CAMERAS.map((camera, index) => ({
	value: String(index),
	label: camera.label,
}))

export const CameraSwitch = ({
	value,
	onChange = () => {},
	disabled = false,
}: CameraSwitchProps) => (
	<Toggle
		label={LABEL_CAMERA_SOURCE}
		options={options}
		value={String(value)}
		onChange={next => onChange(Number(next))}
		disabled={disabled}
	/>
)
