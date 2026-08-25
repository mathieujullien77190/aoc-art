/** @format */

import Field from "../ui/Field"
import { LABEL_PUBLIC_KEY } from "../constants"
import { PublicKeyInputProps } from "./types"

export const PublicKeyInput = ({
	value,
	onChange = () => {},
	disabled = false,
}: PublicKeyInputProps) => (
	<Field label={LABEL_PUBLIC_KEY} value={value} onChange={onChange} disabled={disabled} />
)
