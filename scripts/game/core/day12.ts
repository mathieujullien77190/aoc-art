/** @format */

import { input } from "../data/day12"
import { findBestPath } from "../graph"
import { createArray } from "../helpers"

type Position = { x: number; y: number }

type Size = { width: number; height: number }

export const data = input.replace("S", "`").replace("E", "{")

const getSize = (data: string): Size => {
	return {
		width: data.split("\n")[0].length,
		height: (data.match(/\n/g) || []).length + 1,
	}
}

const getCode = c => c.charCodeAt(0)

const getStr = (data: string, pos: Position, size: Size): string => {
	return data[pos.y * (size.width + 1) + pos.x]
}

const setStr = (
	data: string,
	pos: Position,
	size: Size,
	str: string
): string => {
	const index = pos.y * (size.width + 1) + pos.x
	return data.slice(0, index) + str + data.slice(index + 1)
}

const getNeighbours = (data, pos, size) => {
	let current = data[pos.y * (size.width + 1) + pos.x]
	let matrix = [
		{
			cond: pos.y - 1 >= 0,
			pos: (pos.y - 1) * (size.width + 1) + pos.x,
			id: `${pos.x};${pos.y - 1}`,
		},
		{
			cond: pos.y + 1 < size.height,
			pos: (pos.y + 1) * (size.width + 1) + pos.x,
			id: `${pos.x};${pos.y + 1}`,
		},
		{
			cond: pos.x - 1 >= 0,
			pos: pos.y * (size.width + 1) + pos.x - 1,
			id: `${pos.x - 1};${pos.y}`,
		},
		{
			cond: pos.x + 1 < size.width,
			pos: pos.y * (size.width + 1) + pos.x + 1,
			id: `${pos.x + 1};${pos.y}`,
		},
	]

	return matrix
		.filter(
			item => item.cond && getCode(data[item.pos]) <= getCode(current) + 1
		)
		.map(item => ({ value: data[item.pos], id: item.id }))
}

const extract = id => {
	const arr = id.split(";")
	return { x: +arr[0], y: +arr[1] }
}

const canGo = name => {
	const size = getSize(data)
	return getNeighbours(data, extract(name), size).map(item => ({
		name: item.id,
		value: 1,
	}))
}

const searchEnd = (data: string, size: Size) => {
	const realValue = data.indexOf("{")
	const y = Math.floor(realValue / (size.width + 1))
	const x = realValue - y * (size.width + 1)

	return [x, y].join(";")
}

const searchStart = (data: string, size: Size) => {
	const realValue = data.indexOf("`")
	const y = Math.floor(realValue / (size.width + 1))
	const x = realValue - y * (size.width + 1)

	return [x, y].join(";")
}

const createBasePlan = (altitude: number, size: Size) => {
	let plans = {}

	for (let i = 0; i < altitude; i++) {
		plans[`z${i}`] = createArray(size.height)
			.map(() => " ".repeat(size.width))
			.join("\n")
	}

	return plans
}

export const init = (data): Record<string, string>[] => {
	const size = getSize(data)
	const start = searchStart(data, size)
	const end = searchEnd(data, size)

	let timePlans = []

	const min = getCode("`")
	const max = getCode("{")
	const altitude = max - min + 1

	const basePlan = getAllPlan(data, size, createBasePlan(altitude, size))
	timePlans.push(basePlan)
	let updateBase = { ...basePlan }

	const res = findBestPath(start, end, canGo, (list, index) => {
		if (index % 20 === 0) {
			updateBase = updateAllPlan(
				data,
				{ ...basePlan, ...updateBase },
				list,
				size,
				"*"
			)
			timePlans.push(updateBase)
		}
	})

	timePlans.push({ ...basePlan })
	updateBase = { ...basePlan }

	for (let i = 0; i < res.length; i++) {
		updateBase = updateAllPlan(
			data,
			{ ...basePlan, ...updateBase },
			{ [res[i]]: true },
			size,
			"@"
		)
		timePlans.push(updateBase)
	}

	return timePlans
}

export const getAllPlan = (
	data: string,
	size: Size,
	plans: Record<string, string>
): Record<string, string> => {
	const min = getCode("`")

	for (let y = 0; y < size.height; y++) {
		for (let x = 0; x < size.width; x++) {
			const str = getStr(data, { x, y }, size)
			const alt = getCode(str) - min

			plans[`z${alt}`] = setStr(plans[`z${alt}`], { x, y }, size, "#")
		}
	}

	return plans
}

export const updateAllPlan = (
	data: string,
	plans: Record<string, string>,
	list: Record<string, any>,
	size: Size,
	strReplace: string
) => {
	let newPlans = {}
	const min = getCode("`")

	for (let key in list) {
		const pos = extract(key)
		const str = getStr(data, pos, size)
		const alt = getCode(str) - min
		const testStr = getStr(plans[`z${alt}`], pos, size)

		if (testStr !== strReplace) {
			if (!newPlans[`z${alt}`]) newPlans[`z${alt}`] = plans[`z${alt}`]
			newPlans[`z${alt}`] = setStr(newPlans[`z${alt}`], pos, size, strReplace)
		}
	}

	return newPlans
}
