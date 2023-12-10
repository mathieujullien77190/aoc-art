/** @format */
import { input, input2 } from "_games/data/day10"

import { View, Position } from "_games/helpers/types"
import { dijkstra } from "_games/helpers/graph"
import {
	createView,
	getNeighbours,
	getChar,
	setChar,
	searchChar,
	copyView,
	iterator,
} from "_games/helpers/view"
import { createArray } from "_games/helpers/utils"

const extractPositionFromKey = (id: string): Position => {
	const arr = id.split(";")
	return { x: +arr[0], y: +arr[1] }
}

const createKeyFromPosition = (pos: Position): string => {
	return `${pos.x};${pos.y}`
}

const addSpaces = (view: View): View => {
	let txt = ""
	let Y = 0
	const mid =
		"#\n" +
		createArray(view.size.width * 2 + 1)
			.map(() => "#")
			.join("") +
		"\n"
	txt += mid.substr(2)

	iterator(view, (pos, str) => {
		if (Y !== pos.y) {
			txt += mid
		}
		txt += "#" + str
		Y = pos.y
	})
	txt += mid
	return createView(txt)
}

let mapView = addSpaces(createView(input2))
let mapView2

const canGo2 = name => {
	const pos = extractPositionFromKey(name)
	let neighbours = getNeighbours(mapView2, pos, 1).filter(
		item => getChar(mapView2, item.pos) !== "@"
	)

	const search = neighbours.map(item => ({
		name: createKeyFromPosition(item.pos),
		value: 1,
	}))
	return search
}

const canGo = name => {
	const pos = extractPositionFromKey(name)
	const value = getChar(mapView, pos)

	let neighbours = getNeighbours(mapView, pos, 1)

	if (value === "#")
		neighbours = neighbours.filter(item => getChar(mapView, item.pos) !== "#")
	if (value === "F")
		neighbours = neighbours.filter(
			item => item.type === "R" || item.type === "B"
		)
	if (value === "-")
		neighbours = neighbours.filter(
			item => item.type === "R" || item.type === "L"
		)
	if (value === "7")
		neighbours = neighbours.filter(
			item => item.type === "L" || item.type === "B"
		)
	if (value === "J")
		neighbours = neighbours.filter(
			item => item.type === "T" || item.type === "L"
		)
	if (value === "L")
		neighbours = neighbours.filter(
			item => item.type === "T" || item.type === "R"
		)
	if (value === "|")
		neighbours = neighbours.filter(
			item => item.type === "T" || item.type === "B"
		)
	if (value === "S")
		neighbours = neighbours.filter(
			item => item.type === "B" || item.type === "R"
		)

	const search = neighbours.map(item => ({
		name: createKeyFromPosition(item.pos),
		value: value === "#" ? 0 : 1,
	}))
	return search
}

export const init = (): View[] => {
	let timeViews = [mapView]
	let tempView = copyView(mapView)

	const start = searchChar(mapView, "S")

	tempView = setChar(tempView, start, " ")
	timeViews.push(tempView)

	const res = dijkstra(createKeyFromPosition(start), canGo, a => {
		const pos = extractPositionFromKey(a.current.name)

		tempView = copyView(tempView)
		tempView = setChar(tempView, pos, "@")
		timeViews.push(tempView)
	})

	console.log(
		"Part 1 ",
		Math.max(...Object.values(res).map(item => item.calcValue))
	)

	mapView2 = copyView(tempView)

	dijkstra(createKeyFromPosition({ x: 0, y: 0 }), canGo2, a => {
		const pos = extractPositionFromKey(a.current.name)

		tempView = copyView(tempView)
		tempView = setChar(tempView, pos, "+")
		timeViews.push(tempView)
	})

	console.log("Part 2 ", tempView.value.replace(/[\+@#\n]/gi, "").length)

	iterator(tempView, (pos, str) => {
		if (str === "+") {
			tempView = copyView(tempView)
			tempView = setChar(tempView, pos, " ")
			timeViews.push(tempView)
		}
	})

	iterator(tempView, (pos, str) => {
		if (str === "@") {
			tempView = copyView(tempView)
			tempView = setChar(tempView, pos, " ")
			timeViews.push(tempView)
		}
	})

	iterator(tempView, (pos, str) => {
		if (str === "#") {
			tempView = copyView(tempView)
			tempView = setChar(tempView, pos, " ")
			timeViews.push(tempView)
		}
	})

	return timeViews
}
