/** @format */

import { stringify } from "querystring"
import { input } from "../data/day18"
import { createArray, extractTab2 } from "../helpers"

type Position = { x: number; y: number; z: number }
type Type = "base" | "search"
type Cube = Position & { type: Type }

type Blocks = {
	blockYMax: Cube
	blockYMin: Cube
	blockXMax: Cube
	blockXMin: Cube
	blockZMax: Cube
	blockZMin: Cube
}

type SearchBlocks = { blocks: Blocks; inside: boolean }

const createCube = (pos: Position, type: Type): Cube => ({
	...pos,
	type,
})

const createKey = (pos: Position): string => `x${pos.x}y${pos.y}z${pos.z}`

export const data = extractTab2(input, "\n", ",").map(line => {
	return createCube({ x: +line[0], y: +line[1], z: +line[2] }, "base")
}) as Cube[]

export const max = {
	x: Math.max(...data.map(cube => cube.x)) + 1,
	y: Math.max(...data.map(cube => cube.y)) + 1,
	z: Math.max(...data.map(cube => cube.z)) + 1,
}

const isInData = (data: Cube[], pos: Position): boolean => {
	return (
		data.filter(
			cube => cube.x === pos.x && cube.y === pos.y && cube.z === pos.z
		).length > 0
	)
}

const inOutside = (
	outside: Record<string, Position>,
	direction: Cube[]
): boolean => {
	return (
		direction
			.map(pos => (outside[createKey(pos)] ? true : false))
			.filter(item => !!item).length > 0
	)
}

const searchBlockDirection = (
	data: Cube[],
	max: Position,
	pos: Position
): SearchBlocks => {
	let blockYMax, blockYMin, blockXMax, blockXMin, blockZMax, blockZMin

	for (let i = 0; i < data.length; i++) {
		const scan = data[i]
		if (
			scan.z === pos.z &&
			scan.x === pos.x &&
			scan.y > pos.y &&
			(!blockYMax || scan.y < blockYMax.y)
		)
			blockYMax = scan
		if (
			scan.z === pos.z &&
			scan.x === pos.x &&
			scan.y < pos.y &&
			(!blockYMin || scan.y > blockYMin.y)
		)
			blockYMin = scan
		if (
			scan.z === pos.z &&
			scan.y === pos.y &&
			scan.x > pos.x &&
			(!blockXMax || scan.x < blockXMax.x)
		)
			blockXMax = scan
		if (
			scan.z === pos.z &&
			scan.y === pos.y &&
			scan.x < pos.x &&
			(!blockXMin || scan.x > blockXMin.x)
		)
			blockXMin = scan
		if (
			scan.y === pos.y &&
			scan.x === pos.x &&
			scan.z > pos.z &&
			(!blockZMax || scan.z < blockZMax.z)
		)
			blockZMax = scan
		if (
			scan.y === pos.y &&
			scan.x === pos.x &&
			scan.z < pos.z &&
			(!blockZMin || scan.z > blockZMin.z)
		)
			blockZMin = scan
	}

	return {
		inside: isBetween({
			blockYMax,
			blockYMin,
			blockXMax,
			blockXMin,
			blockZMax,
			blockZMin,
		}),
		blocks: {
			blockYMax: blockYMax || { x: pos.x, z: pos.z, y: max.y + 1 },
			blockYMin: blockYMin || { x: pos.x, z: pos.z, y: -1 },
			blockXMax: blockXMax || { x: max.x + 1, z: pos.z, y: pos.y },
			blockXMin: blockXMin || { x: -1, z: pos.z, y: pos.y },
			blockZMax: blockZMax || { x: pos.x, z: max.z + 1, y: pos.y },
			blockZMin: blockZMin || { x: pos.x, z: -1, y: pos.y },
		},
	}
}

const isBetween = (blocks: Blocks): boolean => {
	return (
		!!blocks.blockYMin &&
		!!blocks.blockYMax &&
		!!blocks.blockXMax &&
		!!blocks.blockXMin &&
		!!blocks.blockZMax &&
		!!blocks.blockZMin
	)
}

const allCubesDirection = (blocks: Blocks): Cube[] => {
	const startX = blocks.blockXMin.x
	const stopX = blocks.blockXMax.x
	const cubesX = createArray(stopX - startX - 1).map((_, i) =>
		createCube(
			{ x: startX + i + 1, y: blocks.blockXMin.y, z: blocks.blockXMin.z },
			"search"
		)
	)
	const startY = blocks.blockYMin.y
	const stopY = blocks.blockYMax.y
	const cubesY = createArray(stopY - startY - 1).map((_, i) =>
		createCube(
			{ y: startY + i + 1, x: blocks.blockYMin.x, z: blocks.blockYMin.z },
			"search"
		)
	)
	const startZ = blocks.blockZMin.z
	const stopZ = blocks.blockZMax.z
	const cubesZ = createArray(stopZ - startZ - 1).map((_, i) =>
		createCube(
			{ z: startZ + i + 1, y: blocks.blockZMin.y, x: blocks.blockZMin.x },
			"search"
		)
	)
	return [...cubesX, ...cubesY, ...cubesZ]
}

export const searchInsideCube = (data: Cube[], max: Position) => {
	let notInside: Record<string, Position> = {}
	let inside: Record<string, Position> = {}
	let searchBlocks, badPos, potentialGood

	let x = 0,
		y = 1,
		z = 7

	for (let x = 0; x <= max.x; x++) {
		for (let y = 0; y <= max.y; y++) {
			for (let z = 0; z < max.z; z++) {
				const scan = { x, y, z }
				if (!isInData(data, scan) && !notInside[createKey(scan)]) {
					searchBlocks = searchBlockDirection(data, max, scan)
					if (searchBlocks.inside) {
						potentialGood = allCubesDirection(searchBlocks.blocks)
						if (inOutside(notInside, potentialGood)) {
							for (let i = 0; i < potentialGood.length; i++) {
								notInside[createKey(potentialGood[i])] = potentialGood[i]
							}
						} else {
							inside[createKey(scan)] = scan
						}
					} else {
						badPos = allCubesDirection(searchBlocks.blocks)
						for (let i = 0; i < badPos.length; i++) {
							notInside[createKey(badPos[i])] = badPos[i]
						}
					}
				}
			}
		}
	}

	return { notInside, inside }
}

export const getPlan = (
	data: Cube[],
	inside: Record<string, Position>,
	notInside: Record<string, Position>,
	z: Number
): string => {
	const drawZ = createArray(max.y + 1).map(() =>
		createArray(max.x + 1).map(() => " ")
	)

	data
		.filter(item => item.z === z)
		.forEach(cube => {
			drawZ[cube.y][cube.x] = "#"
		})

	Object.values(inside).forEach(pos => {
		if (pos.z === z) {
			drawZ[pos.y][pos.x] = "x"
		}
	})

	Object.values(notInside).forEach(pos => {
		if (pos.z === z) {
			drawZ[pos.y][pos.x] = "."
		}
	})

	console.log(Object.values(inside).length, Object.values(notInside).length)

	return drawZ.map(line => line.join("")).join("\n")
}

export const getAllPlan = (
	data: Cube[],
	inside: Record<string, Position>,
	notInside: Record<string, Position>
): string[] => {
	const draw = []

	for (let z = 0; z < max.z; z++) {
		draw[z] = getPlan(data, inside, notInside, z)
	}

	return draw
}

export const volcano = [
	"<span>                      ooO",
	"                     ooOOOo",
	"                   oOOOOOOoooo",
	"                 ooOOOooo  oooo",
	'                /vvv\\\\              </span><span class="text">Scanning...</span><span>',
	'               /V V V\\\\            </span><span class="text">/</span><span>',
	'              /V  V  V\\\\         </span><span class="text">[</span><span class="target">@</span><span class="text">]</span><span> ',
	"             /         \\\\                          ",
	"            /           \\\\                             __",
	"          /               \\\\       o          o    .--()° .'",
	"         /                 \\\\     /-   o     /-  '|, . ,'",
	"       /                     \\\\  /\\\\  -/-   /\\\\   !_-(_\\",
	"                                      /\\\\</span>",
].join("\n")
