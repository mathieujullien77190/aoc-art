/** @format */

import { createArray } from "./utils"
import { View, ViewPlan, Position, Size } from "./types"
import { createEmptyView, searchChar, getChar } from "./view"

export const extractView = (plans: ViewPlan, z: number): View => {
	return {
		value: plans.value[z],
		size: plans.size,
	}
}

export const copyViewPlan = (
	plans: ViewPlan,
	meta: Record<string, string> = undefined
): ViewPlan => ({
	value: [...plans.value],
	size: plans.size,
	meta: meta ? meta : { ...plans.meta },
})

export const createEmptyViewPlan = (
	size: Size,
	nb: number,
	str: string = " ",
	meta: Record<string, string> = {}
): ViewPlan => {
	const plan = createEmptyView(size, str)

	return {
		value: createArray(nb).map(() => plan.value),
		size,
		meta,
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
