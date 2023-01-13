/** @format */

import React, { useCallback, useEffect, useMemo, useState } from "react"

import { isMobile } from "react-device-detect"

import { createArray } from "_games/helpers/utils"
import { Action } from "_games/components/Action"

import { modulo } from "_games/helpers/math"

import * as S from "./UI"
import { SliderProps } from "./types"

export const Slider = ({
	label,
	max,
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

	const formatValue = (loop ? modulo(localValue, max) : localValue).toString()

	useEffect(() => {
		setLocalValue(Math.floor(value / step) * step)
	}, [value])

	return (
		<S.ContainerSlider>
			<S.Label>
				{label} ({formatValue}
				{unit})&nbsp;:&nbsp;
			</S.Label>

			<S.Actions>
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
			</S.Actions>
		</S.ContainerSlider>
	)
}
