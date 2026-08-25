/** @format */

import { ToggleProps } from "./types"
import * as S from "./UI"

/** groupe de boutons a choix unique : presentation seule, aucune logique */
export const Toggle = ({
	label,
	options,
	value,
	onChange = () => {},
}: ToggleProps) => (
	<S.Container>
		<S.Text>{label}</S.Text>
		<S.Buttons>
			{options.map(option => (
				<S.Button
					key={option.value}
					type="button"
					$active={option.value === value}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</S.Button>
			))}
		</S.Buttons>
	</S.Container>
)
