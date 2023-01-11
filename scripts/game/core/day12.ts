/** @format */

import { input } from "../data/day12"
import { findBestPath } from "../graph"
import { createArray } from "../helpers"

type Position = { x: number; y: number }

type Size = { width: number; height: number }

export const data = input.replace("S", "`").replace("E", "{")

const W = data.split("\n")[0].length
const H = (data.match(/\n/g) || []).length + 1

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

const getNeighbours = (data, pos) => {
	let current = data[pos.y * (W + 1) + pos.x]
	let matrix = [
		{
			cond: pos.y - 1 >= 0,
			pos: (pos.y - 1) * (W + 1) + pos.x,
			id: `${pos.x};${pos.y - 1}`,
		},
		{
			cond: pos.y + 1 < H,
			pos: (pos.y + 1) * (W + 1) + pos.x,
			id: `${pos.x};${pos.y + 1}`,
		},
		{
			cond: pos.x - 1 >= 0,
			pos: pos.y * (W + 1) + pos.x - 1,
			id: `${pos.x - 1};${pos.y}`,
		},
		{
			cond: pos.x + 1 < W,
			pos: pos.y * (W + 1) + pos.x + 1,
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
	return getNeighbours(data, extract(name)).map(item => ({
		name: item.id,
		value: 1,
	}))
}

const searchEnd = data => {
	const realValue = data.indexOf("{")
	const y = Math.floor(realValue / (W + 1))
	const x = realValue - y * (W + 1)

	return [x, y].join(";")
}

const searchStart = data => {
	const realValue = data.indexOf("`")
	const y = Math.floor(realValue / (W + 1))
	const x = realValue - y * (W + 1)

	return [x, y].join(";")
}

const createBasePlan = (altitude: number, size: Size) => {
	return createArray(altitude).map(() =>
		createArray(size.height)
			.map(() => " ".repeat(size.width))
			.join("\n")
	)
}

export const init = (data): string[][] => {
	const size = getSize(data)
	const start = searchStart(data)
	const end = searchEnd(data)

	let timePlans = []

	const min = getCode("`")
	const max = getCode("{")
	const altitude = max - min + 1

	const basePlan = getAllPlan(data, size, createBasePlan(altitude, size))

	const res = findBestPath(start, end, canGo, (list, index) => {
		if (index % 20 === 0)
			timePlans.push(updateAllPlan(data, [...basePlan], list, size, "*"))
	})

	timePlans.push([...basePlan])

	for (let i = 0; i < res.length; i++) {
		const list = res.reduce((acc, curr, j) => {
			if (j <= i) acc[curr] = true
			return acc
		}, {})
		timePlans.push(updateAllPlan(data, [...basePlan], list, size, "@"))
	}

	return timePlans
}

export const getAllPlan = (
	data: string,
	size: Size,
	plans: string[]
): string[] => {
	const min = getCode("`")

	for (let y = 0; y < size.height; y++) {
		for (let x = 0; x < size.width; x++) {
			const str = getStr(data, { x, y }, size)
			const alt = getCode(str) - min

			plans[alt] = setStr(plans[alt], { x, y }, size, "#")
		}
	}

	return plans
}

export const updateAllPlan = (
	data: string,
	plans: string[],
	list: Record<string, any>,
	size: Size,
	strReplace: string
) => {
	const min = getCode("`")

	for (let key in list) {
		const pos = extract(key)
		const str = getStr(data, pos, size)
		const alt = getCode(str) - min
		plans[alt] = setStr(plans[alt], pos, size, strReplace)
	}

	return plans
}
