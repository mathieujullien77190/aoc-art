/** @format */

import { createArray } from "./utils"
import { View, ViewPlan, Position, Size } from "./types"
import { createEmptyView, searchChar, getChar } from "./view"

export const extractView = (plans: ViewPlan, z: number): View => {
	return {
		value: plans.value[z],
		width: plans.width,
		height: plans.height,
	}
}

export const copyViewPlan = (plans: ViewPlan): ViewPlan => ({
	value: [...plans.value],
	width: plans.width,
	height: plans.height,
})

export const createEmptyViewPlan = (
	size: Size,
	nb: number,
	str: string = " "
): ViewPlan => {
	const plan = createEmptyView(size, str)

	return {
		value: createArray(nb).map(() => plan.value),
		width: size.width,
		height: size.height,
	}
}

export const searchCharPlan = (
	plans: ViewPlan,
	str: string,
	z: number
): Position => {
	return searchChar(extractView(plans, z), str)
}

export const getCharPlan = (
	plans: ViewPlan,
	pos: Position,
	z: number
): string => {
	return getChar(extractView(plans, z), pos)
}
