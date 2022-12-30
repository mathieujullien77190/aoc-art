/** @format */

import { input } from "../data/day18"
import { createArray, extractTab2 } from "../helpers"

type Position = { x: number; y: number; z: number }
type Type = "base"
type Cube = Position & { type: Type; nb: number }

const createCube = (pos: Position, type: Type): Cube => ({
	...pos,
	nb: 0,
	type,
})

const data = extractTab2(input, "\n", ",").map(line => {
	return createCube({ x: +line[0], y: +line[1], z: +line[2] }, "base")
}) as Cube[]

export const max = {
	x: Math.max(...data.map(cube => cube.x)),
	y: Math.max(...data.map(cube => cube.y)),
	z: Math.max(...data.map(cube => cube.z)),
}

export const getPlan = (z: Number): string => {
	const drawZ = createArray(max.y + 1).map(() =>
		createArray(max.x + 1).map(() => " ")
	)

	data
		.filter(item => item.z === z)
		.forEach(cube => {
			drawZ[cube.y][cube.x] = cube.type === "base" ? "#" : "@"
		})

	return drawZ.map(line => line.join("")).join("\n")
}

export const getAllPlan = (): string[] => {
	const draw = []

	for (let i = 0; i < max.z; i++) {
		draw[i] = getPlan(i)
	}

	return draw
}
