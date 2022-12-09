/** @format */
import { input, listStack } from "../data/day5"
import { createArray, rotate90, extractTab2, copy } from "../helpers"
import { createView, mergeView, Position } from "../view"

type Move = { nbs?: number; from: number; to: number }

const createCargoCrane = (heightCase, nbCase) => {
	const pied = [
		"            _______________".split(""),
		"           |CrateMover 9000|".split(""),
		"   ======/===========".split(""),
		...createArray(heightCase + 4).map((item, i) => {
			if (i === 0) return "    ##   |x|".split("")
			if (i === 1) return "    ##   |x|###".split("")
			if (i === 2) return "         |x|###".split("")
			if (i === 3) return "         |x|###".split("")
			else return "         |x|".split("")
		}),
	]
	pied[2] = [...pied[2], ...createArray(nbCase * 5).map(() => "=")]
	pied[pied.length] = [...createArray(nbCase * 5 + 20).map(() => "-")]

	return pied.map((line, i, tab) => [
		...line,
		...createArray(Math.max(...tab.map(item => item.length)) - line.length).map(
			() => " "
		),
	])
}

const getMaxStack = (data: string[][]): number => {
	return Math.max(...data.map(item => item.length))
}

const getDiffStack = (data: string[][], move: Move, target: number): number => {
	const s = move.from < move.to ? move.from : move.to
	const e = move.to > move.from ? move.to : move.from

	return getMaxStack(data.slice(s, e + 1)) - data[target].length
}

const drawStacks = (data: string[][]): string[][] => {
	const max = getMaxStack(data)
	return rotate90(
		data.map(item => [
			...item.map(item2 => ` [${item2}] `),
			...createArray(max - item.length).map(() => "     "),
		])
	).reverse()
}

const getRealPosition = (
	data: string[][],
	x: number,
	y: number,
	sizeBlock: number,
	index: number
): Position => {
	const nbs = data[index].length
	const max = getMaxStack(data)
	return { x: x + index * sizeBlock, y: y + max - nbs }
}

const getUpPositions = (
	data: string[][],
	move: Move,
	start: Position,
	plus: number = 0
): Position[] => {
	const diff = getDiffStack(data, move, move.from) + 1 + plus
	return createArray(diff).map((_, i) => ({
		y: start.y - i - 2 + plus,
		x: start.x,
	}))
}

const getHPositions = (
	data: string[][],
	start: Position,
	sizeBlock: number,
	move: Move
): Position[] => {
	const diffV = getDiffStack(data, move, move.from) + 2
	const diffH = Math.abs(move.from - move.to) - 1
	const sens = move.from < move.to ? 1 : -1
	return createArray(diffH < 0 ? 0 : diffH).map((_, i) => ({
		y: start.y - diffV,
		x: start.x + (i + 1) * sizeBlock * sens,
	}))
}

const getDownPositions = (
	data: string[][],
	move: Move,
	start: Position,
	plus: number = 0
): Position[] => {
	const diff = getDiffStack(data, move, move.to) + 1 + plus
	return createArray(diff).map((_, i) => ({
		y: start.y - diff + i - 1 + plus,
		x: start.x,
	}))
}

const createFil = (start: Position) => {
	const baseFil = createArray(start.y - 3).map(() => "|")
	const rotateFil = rotate90([baseFil])
	return createView(rotateFil, false)
}

const nbCaseMax = 40

const X = 16
const Y = 7
const SIZE_BLOCK = 5

export const generateViews = (dataSize: number) => {
	let stacks, viewBackGround, merge, save, moveBis

	let moves = extractTab2(input, "\n", " ")
		.map(item =>
			item.map(item2 => parseInt(item2)).filter(item2 => !isNaN(item2))
		)
		.map(item =>
			createArray(item[0]).map(() => ({
				nbs: 1,
				from: item[1] - 1,
				to: item[2] - 1,
			}))
		)
		.flat()
		.filter(
			(_, i, tab) => i < Math.floor((tab.length * dataSize) / 100)
		) as Move[]

	let data = copy(listStack)
	let views = []

	moves.forEach((move, i, tab) => {
		moveBis = { nbs: 1, from: i > 0 ? tab[i - 1].to : 0, to: move.from }

		stacks = createView(drawStacks(data), true)
		viewBackGround = createView(createCargoCrane(stacks.height, 9), true)
		merge = mergeView(viewBackGround, stacks, {
			x: X,
			y: Y,
		})

		const startBis = getRealPosition(data, X, Y, SIZE_BLOCK, moveBis.from)

		const endBis = getRealPosition(data, X, Y, SIZE_BLOCK, moveBis.to)
		const UpositionsBis = getUpPositions(data, moveBis, startBis, 1)
		const HpositionsBis = getHPositions(data, startBis, SIZE_BLOCK, moveBis)
		const DpositionsBis = getDownPositions(data, moveBis, endBis, 2)

		const blockBis = createView(` [ ] `, true)
		blockBis.value = `${blockBis.value}`

		const allBis = [...UpositionsBis, ...HpositionsBis, ...DpositionsBis].map(
			(position, i, tab) => {
				const fil = createFil(position)

				const mergeV = mergeView(merge, blockBis, position)

				const mergeT = mergeView(i < tab.length - 1 ? mergeV : merge, fil, {
					x: position.x + 2,
					y: position.y - fil.height,
				})

				return mergeT
			}
		)

		save = data[move.from].slice(-move.nbs)[0]
		data[move.from] = data[move.from].slice(0, -move.nbs)

		stacks = createView(drawStacks(data), true)
		viewBackGround = createView(createCargoCrane(stacks.height, 9), true)
		merge = mergeView(viewBackGround, stacks, {
			x: X,
			y: Y,
		})

		const start = getRealPosition(data, X, Y, SIZE_BLOCK, move.from)

		const end = getRealPosition(data, X, Y, SIZE_BLOCK, move.to)
		const Upositions = getUpPositions(data, move, start)
		const Hpositions = getHPositions(data, start, SIZE_BLOCK, move)
		const Dpositions = getDownPositions(data, move, end, 1)

		const block = createView(` [${save}] `, true)

		const all = [...Upositions, ...Hpositions, ...Dpositions].map(position => {
			const fil = createFil(position)
			const mergeV = mergeView(merge, block, position)
			return mergeView(mergeV, fil, {
				x: position.x + 2,
				y: position.y - fil.height,
			})
		})

		data[move.to] = [...data[move.to], save]

		views = [...views, ...allBis, ...all]
	})

	return views
}
