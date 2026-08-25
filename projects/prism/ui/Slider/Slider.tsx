/** @format */

import { SliderProps } from "./types"
import * as S from "./UI"

/** curseur libelle : presentation seule, aucune logique */
export const Slider = ({
	label,
	value,
	min,
	max,
	step = 1,
	display,
	onChange = () => {},
}: SliderProps) => (
	<S.Container>
		<S.Head>
			{label}
			<S.Value>{display ?? value}</S.Value>
		</S.Head>
		<S.Range
			type="range"
			value={value}
			min={min}
			max={max}
			step={step}
			onChange={event => onChange(Number(event.target.value))}
		/>
	</S.Container>
)
