/** @format */

import { useState, useCallback, useEffect, MutableRefObject } from "react"

import { AxesValue } from "./types"

import { next } from "./helpers"

type AxesTransform = {
	values: AxesValue
	diff: AxesValue
	withTransition: boolean
}

export const useOrientation = (
	start: AxesValue,
	ref: MutableRefObject<HTMLDivElement>
) => {
	const [axes, setAxes] = useState<AxesTransform>({
		values: { V: start.V, H: start.H },
		diff: { V: 0, H: 0 },
		withTransition: false,
	})

	const [matrix, setMatrix] = useState<{
		value: string
		withTransition: boolean
	}>({ value: "", withTransition: false })

	const [saveMatrix, setSaveMatrix] = useState<string>("")

	useEffect(() => {
		if (axes.diff.H !== 0 || axes.diff.V !== 0) {
			const rotate = `rotateY(${axes.diff.H}deg) rotateX(${axes.diff.V}deg)`
			setMatrix({
				value: `${rotate} ${saveMatrix}`,
				withTransition: axes.withTransition,
			})
		}
	}, [axes])

	const fixed = useCallback(() => {
		const current = window.getComputedStyle(ref.current).transform
		const currentMatrix = current === "none" ? "" : current
		setMatrix({
			value: `${currentMatrix}`,
			withTransition: false,
		})
		setSaveMatrix(currentMatrix)
	}, [])

	const add = useCallback(
		(add: AxesValue, withTransition: boolean = false) => {
			const nextV = next(axes.values.V, { min: 0, max: 350 }, add.V)
			const nextH = next(axes.values.H, { min: 0, max: 350 }, add.H)

			setAxes({
				values: { V: nextV.value, H: nextH.value },
				diff: { V: nextV.diff, H: nextH.diff },
				withTransition,
			})
		},
		[axes]
	)

	const change = useCallback(
		(update: AxesValue, withTransition: boolean = false) => {
			setAxes({
				values: update,
				diff: { V: 0, H: 0 },
				withTransition,
			})
			const rotate = `rotateY(${update.H}deg) rotateX(${update.V}deg)`
			setSaveMatrix(``)
			setMatrix({
				value: `${rotate}`,
				withTransition,
			})
		},
		[axes]
	)

	return { axes, matrix, add, fixed, change }
}
