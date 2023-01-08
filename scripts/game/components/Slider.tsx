/** @format */

import React, { useCallback, useEffect, useMemo, useState } from "react"
import styled from "styled-components"

import { isMobile } from "react-device-detect"

import { colors } from "_components/constants"
import { createArray } from "../helpers"
import { Action } from "./Action"

import { modulo } from "./Math"

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

	onChange?: ({ value, diff }: { value: number; diff: number }) => void
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
	const [localValue, setLocalValue] = useState<number>(
		Math.floor(value / step) * step
	)

	const nb = useMemo(
		() => Math.floor(Math.abs(max - min) / step),
		[min, max, step]
	)

	const line = useMemo(() => {
		return createArray(nb + (loop ? 0 : 1)).map((_, i) => {
			const highlight = i * step + min === localValue

			return highlight ? (
				<span key={i} className="highlight">
					0
				</span>
			) : (
				<React.Fragment key={i}>-</React.Fragment>
			)
		})
	}, [nb, localValue, step])

	const handleChange = useCallback(
		newValue => {
			onChange({ value: newValue, diff: newValue - localValue })
			setLocalValue(newValue)
		},
		[localValue]
	)

	const formatValue = (
		" ".repeat(max.toString().length) +
		(loop ? modulo(localValue, max) : localValue).toString()
	).substr(-max.toString().length)

	useEffect(() => {
		setLocalValue(Math.floor(value / step) * step)
	}, [value])

	return (
		<ContainerSlider>
			<>
				<span style={{ width, display: "inline-block" }}>
					{label} ({formatValue}
					{unit})&nbsp;:&nbsp;
				</span>

				{!isMobile && (
					<Action
						value="<<"
						onClick={() =>
							handleChange(
								loop
									? modulo(localValue - bigStep, max)
									: localValue - bigStep < min
									? min
									: localValue - bigStep
							)
						}
					/>
				)}
				<Action
					value="<"
					onClick={() =>
						handleChange(
							loop
								? modulo(localValue - step, max)
								: localValue - step < min
								? min
								: localValue - step
						)
					}
				/>
				{!isMobile && <>{line}</>}
				<Action
					value=">"
					onClick={() => {
						handleChange(
							loop
								? modulo(localValue + step, max)
								: localValue + step > max
								? max
								: localValue + step
						)
					}}
				/>
				{!isMobile && (
					<Action
						value=">>"
						onClick={() =>
							handleChange(
								loop
									? modulo(localValue + bigStep, max)
									: localValue + bigStep > max
									? max
									: localValue + bigStep
							)
						}
					/>
				)}
			</>
		</ContainerSlider>
	)
}
