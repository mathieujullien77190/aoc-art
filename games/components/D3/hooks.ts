import { useState, useCallback, useRef, MutableRefObject } from "react"

import { AxesValue } from "./types"

import { next } from "./helpers"

export type AxesTransform = {
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

	// la matrice figee sert de base a la rotation suivante ; une ref plutot
	// qu'un etat car fixed() et add() s'enchainent parfois dans le meme
	// gestionnaire, avant tout nouveau rendu
	const saveMatrix = useRef<string>("")

	const fixed = useCallback(() => {
		const current = window.getComputedStyle(ref.current).transform
		const currentMatrix = current === "none" ? "" : current
		setMatrix({
			value: `${currentMatrix}`,
			withTransition: false,
		})
		saveMatrix.current = currentMatrix
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

			if (nextV.diff !== 0 || nextH.diff !== 0) {
				const rotate = `rotateY(${nextH.diff}deg) rotateX(${nextV.diff}deg)`
				setMatrix({
					value: `${rotate} ${saveMatrix.current}`,
					withTransition,
				})
			}
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
			saveMatrix.current = ""
			setMatrix({
				value: `${rotate}`,
				withTransition,
			})
		},
		[axes]
	)

	return { axes, matrix, add, fixed, change }
}
