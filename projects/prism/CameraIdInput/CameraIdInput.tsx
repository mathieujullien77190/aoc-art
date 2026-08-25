/** @format */

import Field from "../ui/Field"
import { LABEL_CAMERA_ID } from "../constants"
import { CameraIdInputProps } from "./types"

export const CameraIdInput = ({
	value,
	onChange = () => {},
	disabled = false,
}: CameraIdInputProps) => (
	<Field label={LABEL_CAMERA_ID} value={value} onChange={onChange} disabled={disabled} />
)
