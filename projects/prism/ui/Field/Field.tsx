/** @format */

import { FieldProps } from "./types"
import * as S from "./UI"

export const Field = ({
	label,
	value,
	type = "text",
	min,
	max,
	onChange = () => {},
	onBlur = () => {},
	disabled = false,
}: FieldProps) => (
	<S.Container>
		<S.Text>{label}</S.Text>
		<S.Input
			type={type}
			value={value}
			min={min}
			max={max}
			spellCheck={false}
			autoComplete="off"
			disabled={disabled}
			onChange={event => onChange(event.target.value)}
			onBlur={onBlur}
		/>
	</S.Container>
)
