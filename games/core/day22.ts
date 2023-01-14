/** @format */

import { input } from "_games/data/day22"
import { createArray, extractTab1 } from "_games/helpers/utils"
import { pgcd } from "_games/helpers/math"
import { Matrix } from "_games/helpers/types"

const calcSize = (draw: Matrix) => {
	const height = draw.length
	const width = Math.max(...draw.map(line => line.length))
	const sizeSide = pgcd(height, width)
	const nbLine = height / sizeSide
	const nbCol = width / sizeSide
	return { sizeSide, nbLine, nbCol }
}

export const actions = extractTab1(input, "\n\n")[1]
	.split(/([0-9]+[LR]{1})/gi)
	.filter(item => item !== "")
	.map(item => item.split(/([0-9]+)([LR]{1})/gi).filter(item => item !== ""))
	.map(item => ({ value: +item[0], turn: item[1] }))

export const draw = extractTab1(input, "\n\n")[0]
	.split("\n")
	.map(line => line.split(""))

export const sizes = calcSize(draw)

export const map = {
	"01": {
		right: { name: "02", dir: ">", inv: false },
		left: { name: "20", dir: ">", inv: true },
		up: { name: "30", dir: ">", inv: false },
		down: { name: "11", dir: "v", inv: false },
	},
	"02": {
		right: { name: "21", dir: "<", inv: true },
		left: { name: "01", dir: "<", inv: false },
		up: { name: "30", dir: "^", inv: false },
		down: { name: "11", dir: "<", inv: false },
	},
	"11": {
		right: { name: "02", dir: "^", inv: false },
		left: { name: "20", dir: "v", inv: false },
		up: { name: "01", dir: "^", inv: false },
		down: { name: "21", dir: "v", inv: false },
	},
	"20": {
		right: { name: "21", dir: ">", inv: false },
		left: { name: "01", dir: ">", inv: true },
		up: { name: "11", dir: ">", inv: false },
		down: { name: "30", dir: "v", inv: false },
	},
	"21": {
		right: { name: "02", dir: "<", inv: true },
		left: { name: "20", dir: "<", inv: false },
		up: { name: "11", dir: "^", inv: false },
		down: { name: "30", dir: "<", inv: false },
	},
	"30": {
		right: { name: "21", dir: "^", inv: false },
		left: { name: "01", dir: "v", inv: false },
		up: { name: "20", dir: "^", inv: false },
		down: { name: "02", dir: "v", inv: false },
	},
}

export const organize = (draw: Matrix): Record<string, string> => {
	const sizes = calcSize(draw)
	let cube = {}

	for (let i = 0; i < sizes.sizeSide * sizes.nbLine; i++) {
		for (let j = 0; j < sizes.sizeSide * sizes.nbCol; j++) {
			const Y = Math.floor(i / sizes.sizeSide)
			const X = Math.floor(j / sizes.sizeSide)
			const x = j % sizes.sizeSide
			const y = i % sizes.sizeSide

			if (draw[i] && draw[i][j] && draw[i][j] !== " ") {
				const face = `${Y}${X}`
				if (!cube[face])
					cube[face] = createArray(sizes.sizeSide).map(() =>
						createArray(sizes.sizeSide).map(() => "")
					)

				cube[face][y][x] = draw[i][j]
			}
		}
	}

	for (let i in cube) {
		cube[i] = cube[i].map(line => line.join("")).join("\n")
	}

	return cube
}

const transform = (dir, turn) => {
	if (dir === ">" && turn === "R") return "v"
	if (dir === "v" && turn === "R") return "<"
	if (dir === "<" && turn === "R") return "^"
	if (dir === "^" && turn === "R") return ">"
	if (dir === ">" && turn === "L") return "^"
	if (dir === "v" && turn === "L") return ">"
	if (dir === "<" && turn === "L") return "v"
	if (dir === "^" && turn === "L") return "<"
}

const getPosition = (cube, face, position) => {
	return cube[face][position.y * (sizes.sizeSide + 1) + position.x]
}

export const setPosition = (cube, face, position, action) => {
	return (
		cube[face].substring(0, position.y * (sizes.sizeSide + 1) + position.x) +
		action.dir +
		cube[face].substring(position.y * (sizes.sizeSide + 1) + position.x + 1)
	)
}

const directionConvertor = direction => {
	if (direction === ">") return "right"
	if (direction === "<") return "left"
	if (direction === "v") return "down"
	if (direction === "^") return "up"
}

const getMatrix = action => {
	const dir = directionConvertor(action.dir)
	if (dir === "right") return { y: 0, x: 1 }
	if (dir === "left") return { y: 0, x: -1 }
	if (dir === "up") return { x: 0, y: -1 }
	if (dir === "down") return { x: 0, y: 1 }
}

const getNextFace = (map, face, action) => {
	const dir = directionConvertor(action.dir)
	return map[face][dir]
}

const getNextPosition = (map, position, face, action) => {
	const nextFace = getNextFace(map, face, action)
	if (action.dir === "<" || action.dir === ">") {
		if (nextFace.dir === "<")
			return {
				face: nextFace.name,
				pos: {
					x: sizes.sizeSide - 1,
					y: nextFace.inv ? sizes.sizeSide - position.y - 1 : position.y,
				},
				action: { dir: nextFace.dir },
			}
		if (nextFace.dir === ">")
			return {
				face: nextFace.name,
				pos: {
					x: 0,
					y: nextFace.inv ? sizes.sizeSide - position.y - 1 : position.y,
				},
				action: { dir: nextFace.dir },
			}
		if (nextFace.dir === "v")
			return {
				face: nextFace.name,
				pos: {
					y: 0,
					x: nextFace.inv ? sizes.sizeSide - position.y - 1 : position.y,
				},
				action: { dir: nextFace.dir },
			}
		if (nextFace.dir === "^")
			return {
				face: nextFace.name,
				pos: {
					y: sizes.sizeSide - 1,
					x: nextFace.inv ? sizes.sizeSide - position.y - 1 : position.y,
				},
				action: { dir: nextFace.dir },
			}
	}
	if (action.dir === "^" || action.dir === "v") {
		if (nextFace.dir === "<")
			return {
				face: nextFace.name,
				pos: {
					x: sizes.sizeSide - 1,
					y: nextFace.inv ? sizes.sizeSide - position.x - 1 : position.x,
				},
				action: { dir: nextFace.dir },
			}
		if (nextFace.dir === ">")
			return {
				face: nextFace.name,
				pos: {
					x: 0,
					y: nextFace.inv ? sizes.sizeSide - position.x - 1 : position.x,
				},
				action: { dir: nextFace.dir },
			}
		if (nextFace.dir === "v")
			return {
				face: nextFace.name,
				pos: {
					y: 0,
					x: nextFace.inv ? sizes.sizeSide - position.x - 1 : position.x,
				},
				action: { dir: nextFace.dir },
			}
		if (nextFace.dir === "^")
			return {
				face: nextFace.name,
				pos: {
					y: sizes.sizeSide - 1,
					x: nextFace.inv ? sizes.sizeSide - position.x - 1 : position.x,
				},
				action: { dir: nextFace.dir },
			}
	}
}

const getListPosition = (cube, map, position, face, action) => {
	let x,
		y,
		pos,
		j,
		valueOnMap,
		currentAction,
		change,
		list,
		matrix,
		max,
		currentFace

	j = 0
	list = []
	currentAction = action
	currentFace = face
	pos = { ...position }
	max = action.value

	list.push({ position: pos, face: currentFace, action: currentAction })
	do {
		matrix = getMatrix(currentAction)

		x = pos.x + matrix.x
		y = pos.y + matrix.y

		if (x >= sizes.sizeSide || y >= sizes.sizeSide || x < 0 || y < 0) {
			change = getNextPosition(map, pos, currentFace, currentAction)
			currentFace = change.face
			currentAction = change.action
			pos = change.pos
		} else {
			pos = { x, y }
		}

		valueOnMap = getPosition(cube, currentFace, pos)

		list.push({ position: pos, face: currentFace, action: currentAction })

		j++
	} while (j < max && valueOnMap !== "#")

	if (valueOnMap === "#") list.pop()

	return list
}

const drawPath = (cube, pos) => {
	const newCube = { ...cube }
	newCube[pos.face] = setPosition(newCube, pos.face, pos.position, pos.action)
	return newCube
}

export const goN = (cube, map, actions, startPos, startFace) => {
	let currentFace, currentPosition, newCube, currentAction, res, display

	currentPosition = { ...startPos }
	currentFace = startFace

	newCube = { ...cube }

	display = []

	actions.forEach((action, j, tab) => {
		res = getListPosition(cube, map, currentPosition, currentFace, {
			...action,
			dir: j === 0 ? ">" : transform(currentAction.dir, tab[j - 1].turn),
		})
		currentFace = res[res.length - 1].face
		currentPosition = res[res.length - 1].position
		currentAction = res[res.length - 1].action

		for (let i = 0; i < res.length; i++) {
			newCube = drawPath(newCube, res[i])
			display.push({ cube: newCube, meta: res[i] })
		}
	})

	return display
}
