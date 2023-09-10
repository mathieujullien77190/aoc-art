/** @format */

import { createArray } from "./utils"
import { View, ViewPlan, Position, Size, Position3D } from "./types"
import {
	createEmptyView,
	searchChar,
	getChar,
	iterator as iterator2D,
	setChar,
	searchChars,
	replaceChar,
} from "./view"

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

export const createEmptyViewPlanFromString = (
	plansStr: string[],
	meta: Record<string, string> = undefined
): ViewPlan => {
	const width = plansStr[0].split("\n")[0].length
	const height = plansStr[0].match(/\n/g).length + 1
	return {
		value: [...plansStr],
		size: { width, height },
		meta,
	}
}

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

export const searchCharsPlan = (plans: ViewPlan, str: string): Position3D[] => {
	let positions: Position3D[] = []
	for (let z = 0; z < plans.value.length; z++) {
		positions = [
			...positions,
			...searchChars(extractView(plans, z), str).map(pos => ({ ...pos, z })),
		]
	}

	return positions
}

export const setCharPlan = (
	plans: ViewPlan,
	pos: Position3D,
	str: string
): ViewPlan => {
	const copyPlans = copyViewPlan(plans)

	copyPlans.value[pos.z] = setChar(
		extractView(plans, pos.z),
		{ x: pos.x, y: pos.y },
		str
	).value
	return copyPlans
}

export const replaceCharPlan = (
	plans: ViewPlan,
	str: string,
	replace: string
): ViewPlan => {
	const copyPlans = copyViewPlan(plans)

	for (let z = 0; z < plans.value.length; z++) {
		copyPlans.value[z] = replaceChar(extractView(plans, z), str, replace).value
	}

	return copyPlans
}

export const getCharPlan = (plans: ViewPlan, pos: Position3D): string => {
	return getChar(extractView(plans, pos.z), pos)
}

export const getNeighbours = (
	view: ViewPlan,
	pos: Position3D,
	withDiag: boolean = false
): { value: string; pos: Position3D }[] => {
	const matrix = [
		[0, -1, 0],
		[-1, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, -1],
		[0, 0, 1],
	]

	const matrixDiag = [
		[-1, -1, 0],
		[1, -1, 0],
		[-1, 1, 0],
		[1, 1, 0],
		[-1, -1, 1],
		[1, -1, 1],
		[-1, 1, 1],
		[1, 1, 1],
		[-1, -1, -1],
		[1, -1, -1],
		[-1, 1, -1],
		[1, 1, -1],
	]

	return [...matrix, ...(withDiag ? matrixDiag : [])]
		.map(add => {
			const y = pos.y + add[1]
			const x = pos.x + add[0]
			const z = pos.z + add[2]
			if (
				y >= 0 &&
				y < view.size.height &&
				x >= 0 &&
				x < view.size.width &&
				z >= 0 &&
				z < view.value.length
			) {
				const position = y * (view.size.width + 1) + x
				return { pos: { x, y, z }, value: view.value[z][position] }
			}
			return null
		})
		.filter(value => !!value)
}

export const iterator = (
	plans: ViewPlan,
	cb: (pos: Position3D, str: string) => void
) => {
	for (let z = 0; z < plans.value.length; z++) {
		iterator2D(extractView(plans, z), ({ x, y }, value) => {
			cb({ x, y, z }, value)
		})
	}
}
