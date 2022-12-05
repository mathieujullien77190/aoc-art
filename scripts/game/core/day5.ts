/** @format */
import { input, listStack } from "../data/day5"
import { createArray, rotate90, mergeView, extractTab2 } from "../helpers"

const createCargoCrane = (heightCase, nbCase) => {
	const pied = [
		"            _______________".split(""),
		"           |CrateMover 9000|".split(""),
		"   ======/=========".split(""),
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

const generatedPile = (data, filPosition, nbCaseMax, level) => {
	let item
	const d1 = data.map((item, i, tab) => [
		...item.map(item2 => ` [${item2}] `),
		...createArray(nbCaseMax - item.length + 4).map((item2, j) =>
			filPosition === i && j >= level ? "  |  " : "     "
		),
	])
	if (level > 0) {
		item = ` [${data[filPosition][data[filPosition].length - 1]}] `
		d1[filPosition][data[filPosition].length - 1] = "     "
		d1[filPosition][data[filPosition].length - 1 + level] = item
	}
	return d1.map(item => item.reverse())
}

const generatedView = (data, nbCaseMax, filPosition, level) => {
	const caseDisplay11 = generatedPile(data, filPosition, nbCaseMax, level)

	const caseDisplay2 = rotate90(caseDisplay11)
	const caseDisplay = caseDisplay2.map(line =>
		line.map(element => element.split("")).flat()
	)

	return mergeView(background, caseDisplay, 20, 3)
		.map(item => item.join(""))
		.join("\n")
}

const up = (data, nbCaseMax, position) => {
	const n = nbCaseMax - data[position].length + 3
	return createArray(n).map((_, i) => {
		return generatedView(data, nbCaseMax, position, i)
	})
}

const down = (data, nbCaseMax, position) => {
	const n = nbCaseMax - data[position].length + 3
	return createArray(n).map((_, i) => {
		return generatedView(data, nbCaseMax, position, n - i - 1)
	})
}

const translateX = (view, x, y, width, height, sens) => {
	let arr = extractTab2(view, "\n", "")
	let item
	const add1 = sens === 1 ? x + width - 1 : x
	const add2 = sens === 1 ? x + width : x + sens
	const add3 = sens === 1 ? x + width - 1 : x
	for (let i = y; i < y + height; i++) {
		for (let j = 0; j < width; j++) {
			item = arr[i][add1 + j * -sens]
			arr[i][add2 + j * -sens] = item
			arr[i][add3 + j * -sens] = " "
		}
	}
	return arr.map(item => item.join("")).join("\n")
}

const translateFromTo = (view, from, to) => {
	let views = []

	const diff = Math.abs(to - from)
	const sens = from < to ? 1 : -1
	createArray(diff * 5).forEach((_, i) => {
		view = translateX(view, 21 + i * sens + from * 5, 3, 3, 3, sens)
		views.push(view)
	})

	return views
}

const nbCaseMax = 30

const background = createCargoCrane(nbCaseMax, 9)

export const generateViews = (dataSize: number) => {
	const moves = extractTab2(input, "\n", " ")
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
		.filter((_, i, tab) => i < Math.floor((tab.length * dataSize) / 100))

	let data = listStack
	let views = []

	moves.forEach(move => {
		//const a1 = new Date().getTime()
		views.push(...up(data, nbCaseMax, move.from))
		//const a2 = new Date().getTime()
		views.push(...translateFromTo(views[views.length - 1], move.from, move.to))
		//const a3 = new Date().getTime()
		data[move.to] = [...data[move.to], ...data[move.from].slice(-move.nbs)]
		data[move.from] = data[move.from].slice(0, -move.nbs)
		//const a4 = new Date().getTime()
		views.push(...down(data, nbCaseMax, move.to))
		//const a5 = new Date().getTime()
		//console.log(a2 - a1, a3 - a2, a4 - a3, a5 - a4)
	})

	return views
}
