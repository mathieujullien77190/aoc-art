/** @format */

import React, { useMemo } from "react"
import styled from "styled-components"

import { isMobile } from "react-device-detect"

import { colors } from "_components/constants"
import { createArray } from "../helpers"

const modulo = (value, max) => {
	if (value < 0) return (max - (Math.abs(value) % max)) % max
	return value % max
}

const ContainerSlider = styled.div`
	margin: 5px 0;
	padding: 5px;
	background: black;

	.highlight {
		color: ${colors.background};
		font-weight: bold;
		background-color: ${colors.importantColor};
	}
`

const ActionContainer = styled.button<{ highlight: boolean }>`
	background-color: ${({ highlight }) =>
		highlight ? colors.importantColor : "transparent"};
	color: ${({ highlight }) =>
		highlight ? colors.background : colors.textColor};
	font-weight: ${({ highlight }) => (highlight ? "bold" : "normal")};

	padding: 0;
	margin: 0 2px;
	cursor: pointer;
	font-family: monospace;
	border: none;
	height: 25px;
	min-width: 30px;
	display: inline-flex;
	justify-content: center;
	align-items: center;

	&:hover {
		color: ${colors.background};
		font-weight: bold;
		background-color: ${colors.importantColor};
	}
`

type SliderProps = {
	label: string
	max: number
	width?: string
	value?: number
	min?: number
	loop?: boolean
	step?: number
	bigStep?: number
	unit?: string

	onChange?: (value: number) => void
}

type ActionProps = {
	value: string

	highlight?: boolean
	onClick?: () => void
}

const Action = ({
	value,

	highlight = false,
	onClick = () => {},
}: ActionProps) => {
	return (
		<>
			<ActionContainer onClick={onClick} highlight={highlight}>
				{value}
			</ActionContainer>
		</>
	)
}

export const Slider = ({
	label,
	max,
	width = "auto",
	value = 0,
	min = 0,
	loop = false,
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
		return createArray(nb + (loop ? 0 : 1)).map((_, i) => {
			const highlight = i * step + min === (loop ? modulo(value, max) : value)

			return highlight ? (
				<span key={i} className="highlight">
					0
				</span>
			) : (
				<React.Fragment key={i}>-</React.Fragment>
			)
		})
	}, [nb, value, step])

	const formatValue = (
		" ".repeat(max.toString().length) +
		(loop ? modulo(value, max) : value).toString()
	).substr(-max.toString().length)
	return (
		<ContainerSlider>
			<>
				<span style={{ width, display: "inline-block" }}>
					{label} ({formatValue}
					{unit})&nbsp;:&nbsp;
				</span>
				{!isMobile && <Action value="[Min]" onClick={() => onChange(min)} />}
				{!isMobile && (
					<Action
						value="<<"
						onClick={() =>
							onChange(value - bigStep < min && !loop ? min : value - bigStep)
						}
					/>
				)}
				<Action
					value="<"
					onClick={() =>
						onChange(value - step < min && !loop ? min : value - step)
					}
				/>
				{!isMobile && <>{line}</>}
				<Action
					value=">"
					onClick={() => {
						console.log(loop)
						onChange(value + step > max && !loop ? max : value + step)
					}}
				/>
				{!isMobile && (
					<Action
						value=">>"
						onClick={() =>
							onChange(value + bigStep > max && !loop ? max : value + bigStep)
						}
					/>
				)}
				{!isMobile && <Action value="[Max]" onClick={() => onChange(max)} />}
			</>
		</ContainerSlider>
	)
}
