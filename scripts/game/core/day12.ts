/** @format */

import { input } from "../data/day12"
import { findBestPath } from "../graph"
import { createArray } from "../helpers"

type Position = { x: number; y: number }

type Size = { width: number; height: number }

const getSize = (data: string): Size => {
	return {
		width: data.split("\n")[0].length,
		height: (data.match(/\n/g) || []).length + 1,
	}
}

export const data = input.replace("S", "`").replace("E", "{")
export const size = getSize(data)

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

const getNeighbours = (data: string, size: Size, pos: Position) => {
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
	return getNeighbours(data, size, extract(name)).map(item => ({
		name: item.id,
		value: 1,
	}))
}

const searchEnd = (data: string, size: Size) => {
	const realValue = data.indexOf("{")
	const y = Math.floor(realValue / (size.width + 1))
	const x = realValue - y * (size.width + 1)

	return [x, y]
}

const searchStart = (data: string, size: Size) => {
	const realValue = data.indexOf("`")
	const y = Math.floor(realValue / (size.width + 1))
	const x = realValue - y * (size.width + 1)

	return [x, y]
}

const createView = (
	data: string[],
	text: string
): { data: string[]; meta: string } => {
	return { data, meta: text }
}

export const init = (data, size): { data: string[]; meta: string }[] => {
	const start = searchStart(data, size)
	const end = searchEnd(data, size)

	let timePlans = []

	const min = getCode("`")
	const max = getCode("{")
	const altitude = max - min + 1

	const basePlan = createBasePlan(altitude, size)

	for (let i = 0; i < size.width; i++) {
		timePlans.push(
			createView(
				getLettersPlan(data, size, [...basePlan], i, 0, { start, end }),
				"Construction de la carte"
			)
		)
	}

	for (let i = 0; i < altitude; i++) {
		timePlans.push(
			createView(
				getElevationPlan(data, size, [...basePlan], i, { start, end }),
				"Construction de la carte"
			)
		)
	}

	const startPlan = getElevationPlan(data, size, [...basePlan], altitude - 1, {
		start,
		end,
	})

	const res = findBestPath(
		start.join(";"),
		end.join(";"),
		canGo,
		(list, index) => {
			if (index % 20 === 0)
				timePlans.push(
					createView(
						updateAllPlan(data, [...startPlan], list, size, "#", {
							start,
							end,
						}),
						"Exécution via de l'algorithme de Dijkstra"
					)
				)
		}
	)

	const middlePlan = getNormalPlan(data, size, [...basePlan], { start, end })

	for (let i = 0; i < res.length; i++) {
		const list = res.reduce((acc, curr, j) => {
			if (j <= i) acc[curr] = true
			return acc
		}, {})
		timePlans.push(
			createView(
				updateAllPlan(data, [...middlePlan], list, size, "@", { start, end }),
				`Extraction du chemin le plus court ( ${Object.values(list).length} )`
			)
		)
	}

	return timePlans
}

const createBasePlan = (altitude: number, size: Size) => {
	return createArray(altitude).map(() =>
		createArray(size.height)
			.map(() => " ".repeat(size.width))
			.join("\n")
	)
}

const isSpecial = (specialPos: number[], pos: Position) => {
	return specialPos[0] === pos.x && specialPos[1] === pos.y
}

const getChar = (
	baseChar: string,
	pos: Position,
	startEnd: { start: number[]; end: number[] }
) => {
	const startStr = isSpecial(startEnd.start, pos) || null
	const endStr = isSpecial(startEnd.end, pos) || null

	if (startStr) return "@"
	if (endStr) return "@"
	return baseChar
}

export const getLettersPlan = (
	data: string,
	size: Size,
	plans: string[],
	maxWidth: number,
	altitude: number,
	startEnd: { start: number[]; end: number[] }
): string[] => {
	for (let y = 0; y < maxWidth && y < size.height; y++) {
		for (let x = 0; x < maxWidth && x < size.width; x++) {
			const str = getStr(data, { x, y }, size)

			plans[altitude] = setStr(
				plans[altitude],
				{ x, y },
				size,
				getChar(str, { x, y }, startEnd)
			)
		}
	}

	return plans
}

export const getElevationPlan = (
	data: string,
	size: Size,
	plans: string[],
	alt: number,
	startEnd: { start: number[]; end: number[] }
): string[] => {
	const min = getCode("`")

	for (let y = 0; y < size.height; y++) {
		for (let x = 0; x < size.width; x++) {
			const str = getStr(data, { x, y }, size)
			const altStr = getCode(str) - min

			plans[altStr > alt ? alt : altStr] = setStr(
				plans[altStr > alt ? alt : altStr],
				{ x, y },
				size,
				getChar(str, { x, y }, startEnd)
			)
		}
	}

	return plans
}

export const getNormalPlan = (
	data: string,
	size: Size,
	plans: string[],
	startEnd: { start: number[]; end: number[] }
): string[] => {
	const min = getCode("`")

	for (let y = 0; y < size.height; y++) {
		for (let x = 0; x < size.width; x++) {
			const str = getStr(data, { x, y }, size)
			const alt = getCode(str) - min

			plans[alt] = setStr(
				plans[alt],
				{ x, y },
				size,
				getChar("#", { x, y }, startEnd)
			)
		}
	}

	return plans
}

export const updateAllPlan = (
	data: string,
	plans: string[],
	list: Record<string, any>,
	size: Size,
	strReplace: string,
	startEnd: { start: number[]; end: number[] }
) => {
	const min = getCode("`")

	for (let key in list) {
		const pos = extract(key)
		const str = getStr(data, pos, size)
		const alt = getCode(str) - min
		plans[alt] = setStr(
			plans[alt],
			pos,
			size,
			getChar(strReplace, pos, startEnd)
		)
	}

	return plans
}
