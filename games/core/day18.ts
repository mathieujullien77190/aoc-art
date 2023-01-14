/** @format */

import { input } from "_games/data/day18"
import { createArray, extractTab2 } from "_games/helpers/utils"
import {
	Position3D as Position,
	Boundary3D as Limits,
	MinMax,
} from "_games/helpers/types"

type LPosition = Record<string, Position>

type Blocks = {
	x: MinMax
	y: MinMax
	z: MinMax
}

type SearchBlocks = { blocks: Blocks; inside: boolean }

type Data = { base: LPosition; limits: Limits }

const createKey = (pos: Position): string => `x${pos.x}y${pos.y}z${pos.z}`

const iterator = (
	data: LPosition,
	cb: (position: Position) => void,
	filter: (pos: Position) => boolean = () => true
) => {
	for (const i in data) {
		if (filter(data[i])) cb(data[i])
	}
}

const add = (data: LPosition, addData: LPosition) => {
	for (let i in addData) {
		data[createKey(addData[i])] = addData[i]
	}
}

export const data = extractTab2(input, "\n", ",").reduce(
	(acc, line) => {
		const pos = { x: +line[0], y: +line[1], z: +line[2] }
		acc.base[createKey(pos)] = pos

		if (pos.x >= acc.limits.xMax) acc.limits.xMax = pos.x + 1
		if (pos.y >= acc.limits.yMax) acc.limits.yMax = pos.y + 1
		if (pos.z >= acc.limits.zMax) acc.limits.zMax = pos.z + 1
		if (pos.x <= acc.limits.xMin) acc.limits.xMin = pos.x - 1
		if (pos.y <= acc.limits.yMin) acc.limits.yMin = pos.y - 1
		if (pos.z <= acc.limits.zMin) acc.limits.zMin = pos.z - 1
		return acc
	},
	{
		base: {},
		limits: {
			xMax: -Number.MAX_VALUE,
			yMax: -Number.MAX_VALUE,
			zMax: -Number.MAX_VALUE,
			xMin: Number.MAX_VALUE,
			yMin: Number.MAX_VALUE,
			zMin: Number.MAX_VALUE,
		},
	}
) as Data

const isInData = (data: LPosition, pos: Position): boolean =>
	!!data[createKey(pos)]

const inOutside = (outside: LPosition, direction: LPosition): boolean => {
	let isIn = false
	iterator(direction, pos => {
		if (outside[createKey(pos)]) isIn = true
	})
	return isIn
}

const searchBlockDirection = (
	data: LPosition,
	limits: Limits,
	pos: Position
): SearchBlocks => {
	let blockYMax, blockYMin, blockXMax, blockXMin, blockZMax, blockZMin

	iterator(data, scan => {
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
	})

	return {
		inside: isBetween({
			x: {
				min: blockXMin,
				max: blockXMax,
			},
			y: {
				min: blockYMin,
				max: blockYMax,
			},
			z: {
				min: blockZMin,
				max: blockZMax,
			},
		}),
		blocks: {
			x: {
				min: blockXMin || { x: limits.xMin, z: pos.z, y: pos.y },
				max: blockXMax || { x: limits.xMax, z: pos.z, y: pos.y },
			},
			y: {
				min: blockYMin || { x: pos.x, z: pos.z, y: limits.yMin },
				max: blockYMax || { x: pos.x, z: pos.z, y: limits.yMax },
			},
			z: {
				min: blockZMin || { x: pos.x, z: limits.zMin, y: pos.y },
				max: blockZMax || { x: pos.x, z: limits.zMax, y: pos.y },
			},
		},
	}
}

const isBetween = (blocks: Blocks): boolean =>
	!!blocks.y.min &&
	!!blocks.y.max &&
	!!blocks.x.min &&
	!!blocks.x.max &&
	!!blocks.z.min &&
	!!blocks.z.max

const allCubesDirection = (blocks: Blocks): LPosition => {
	const dim = ["x", "y", "z"]
	let cubes: LPosition = {}

	for (let j in blocks) {
		const otherDim = dim.filter(item => item !== j)
		const start = blocks[j].min[j]
		const stop = blocks[j].max[j]
		for (let i = start + 1; i <= stop - 1; i++) {
			const pos = {
				[j]: i,
				[otherDim[0]]: blocks[j].min[otherDim[0]],
				[otherDim[1]]: blocks[j].min[otherDim[1]],
			} as Position
			cubes[createKey(pos)] = pos
		}
	}

	return cubes
}

export const searchInsideCube = (data: Data) => {
	let outside: LPosition = {}
	let inside: LPosition = {}
	let searchBlocks, badPos, potentialGood

	for (let x = data.limits.xMin + 1; x < data.limits.xMax; x++) {
		for (let y = data.limits.yMin + 1; y < data.limits.yMax; y++) {
			for (let z = data.limits.zMin + 1; z < data.limits.zMax; z++) {
				const scan = { x, y, z }
				if (!isInData(data.base, scan) && !outside[createKey(scan)]) {
					searchBlocks = searchBlockDirection(data.base, data.limits, scan)
					if (searchBlocks.inside) {
						potentialGood = allCubesDirection(searchBlocks.blocks)
						if (inOutside(outside, potentialGood)) add(outside, potentialGood)
						else inside[createKey(scan)] = scan
					} else {
						badPos = allCubesDirection(searchBlocks.blocks)
						add(outside, badPos)
					}
				}
			}
		}
	}

	return { outside, inside }
}

export const getPlan = (
	data: LPosition,
	inside: LPosition,
	outside: LPosition,
	limits: Limits,
	z: Number
): string => {
	const drawZ = createArray(limits.yMax - limits.yMin - 1).map(() =>
		createArray(limits.xMax - limits.xMin - 1).map(() => " ")
	)

	iterator(
		data,
		pos => (drawZ[pos.y][pos.x] = "#"),
		pos => pos.z === z
	)

	iterator(
		inside,
		pos => (drawZ[pos.y][pos.x] = "x"),
		pos => pos.z === z
	)

	iterator(
		outside,
		pos => (drawZ[pos.y][pos.x] = "."),
		pos => pos.z === z
	)

	return drawZ.map(line => line.join("")).join("\n")
}

export const getAllPlan = (
	data: LPosition,
	inside: LPosition,
	outside: LPosition,
	limits: Limits
): string[] => {
	const draw = []

	for (let z = 0; z < limits.zMax; z++) {
		draw[z] = getPlan(data, inside, outside, limits, z)
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
