/** @format */

import { ToggleProps } from "./types"
import * as S from "./UI"

export const Toggle = ({
	label,
	options,
	value,
	onChange = () => {},
	disabled = false,
}: ToggleProps) => (
	<S.Container>
		<S.Text>{label}</S.Text>
		<S.Buttons>
			{options.map(option => (
				<S.Button
					key={option.value}
					type="button"
					$active={option.value === value}
					disabled={disabled}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</S.Button>
			))}
		</S.Buttons>
	</S.Container>
)
