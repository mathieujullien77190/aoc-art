/** @format */

import { useMemo } from "react"
import styled from "styled-components"

import { colors } from "_components/constants"
import { createArray } from "../helpers"

const ContainerSlider = styled.pre`
	margin: 5px 0;
	padding: 5px;
	background: black;
`

const ActionContainer = styled.span<{ highlight: boolean }>`
	background-color: ${({ highlight }) =>
		highlight ? colors.importantColor : "transparent"};
	color: ${({ highlight }) => (highlight ? colors.background : "inherited")};
	font-weight: ${({ highlight }) => (highlight ? "bold" : "normal")};

	&:hover {
		color: ${colors.background};
		font-weight: bold;
		background-color: ${colors.importantColor};
	}
`

type SliderProps = {
	label: string
	value?: number
	min?: number
	max: number
	step?: number
	bigStep?: number
	unit?: string
	onChange?: (value: number) => void
}

type ActionProps = {
	value: string
	space?: boolean
	highlight?: boolean
	onClick: () => void
}

const Action = ({
	value,
	space = false,
	highlight = false,
	onClick,
}: ActionProps) => {
	return (
		<>
			<ActionContainer onClick={onClick} highlight={highlight}>
				{value}
			</ActionContainer>
			{space && <> </>}
		</>
	)
}

export const Slider = ({
	label,
	value = 0,
	min = 0,
	max,
	step = 1,
	bigStep = 10,
	unit = "",
	onChange = () => {},
}: SliderProps) => {
	const nb = useMemo(
		() => Math.floor(Math.abs(max - min) / step),
		[min, max, step]
	)
	const line = useMemo(() => {
		return createArray(nb + 1).map((_, i) => (
			<Action
				key={i}
				value={i * step + min === value ? "O" : "-"}
				onClick={() => {
					onChange(i * step + min)
				}}
				highlight={i * step + min === value}
			/>
		))
	}, [nb, value, step])
	const formatValue = (
		" ".repeat(max.toString().length) + value.toString()
	).substr(-max.toString().length)
	return (
		<ContainerSlider>
			<>
				{label} ({formatValue}
				{unit}) : <Action value="[Min]" onClick={() => onChange(min)} space />
				<Action
					value="<<"
					onClick={() =>
						onChange(value - bigStep < min ? min : value - bigStep)
					}
					space
				/>
				<Action
					value="<"
					onClick={() => onChange(value - step < min ? min : value - step)}
					space
				/>
				{line}{" "}
				<Action
					value=">"
					onClick={() => onChange(value + step > max ? max : value + step)}
					space
				/>
				<Action
					value=">>"
					onClick={() =>
						onChange(value + bigStep > max ? max : value + bigStep)
					}
					space
				/>
				<Action value="[Max]" onClick={() => onChange(max)} space />
			</>
		</ContainerSlider>
	)
}
