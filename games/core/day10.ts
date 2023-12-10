/** @format */
import { input } from "_games/data/day10"

import { View, Position } from "_games/helpers/types"
import { dijkstra } from "_games/helpers/graph"
import {
	createView,
	getNeighbours,
	getChar,
	setChar,
	searchChar,
	iterator,
	createEmptyView,
	mergeView,
} from "_games/helpers/view"
import { createArray } from "_games/helpers/utils"

const extractPositionFromKey = (id: string): Position => {
	const arr = id.split(";")
	return { x: +arr[0], y: +arr[1] }
}

const createKeyFromPosition = (pos: Position): string => {
	return `${pos.x};${pos.y}`
}

const addSpaces = (view: View, cb: (txt: string) => void): View => {
	let txt = ""
	let Y = 0
	const mid = () => {
		return (
			" \n" +
			createArray(view.size.width * 2 + 1)
				.map(() => " ")
				.join("") +
			"\n"
		)
	}
	txt += mid().substr(2)

	iterator(view, (pos, str) => {
		if (Y !== pos.y) {
			txt += mid()
		}
		txt += " " + str
		Y = pos.y
		cb(txt)
	})
	txt += mid()
	return createView(txt)
}

let mapView = createView(input)

const canGo2 = name => {
	const pos = extractPositionFromKey(name)
	let neighbours = getNeighbours(mapView, pos, 1).filter(
		item => getChar(mapView, item.pos) !== "@"
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

	if (value === " ")
		neighbours = neighbours.filter(item => getChar(mapView, item.pos) !== " ")
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
		value: value === " " ? 0 : 1,
	}))
	return search
}

export const init = (): View[] => {
	let timeViews = []

	const HEIGHT_TEXT_VIEW = 5

	let backView = createEmptyView({
		width: mapView.size.width * 2 + 1,
		height: mapView.size.height * 2 + HEIGHT_TEXT_VIEW,
	})

	mapView = addSpaces(mapView, txt => {
		timeViews.push(mergeView(backView, createView(txt, true), { x: 0, y: 0 }))
	})

	const start = searchChar(mapView, "S")

	const res = dijkstra(createKeyFromPosition(start), canGo, a => {
		const pos = extractPositionFromKey(a.current.name)

		mapView = setChar(mapView, pos, "@")

		timeViews.push(
			setChar(
				mergeView(backView, mapView, { x: 0, y: 0 }),
				{ x: 0, y: backView.size.height - 2 },
				`Part 1 : ${a.current.calcValue}`
			)
		)
	})

	backView = setChar(
		backView,
		{ x: 0, y: backView.size.height - 2 },
		`Part 1 : ${Math.max(...Object.values(res).map(item => item.calcValue))}`
	)
	backView = setChar(
		backView,
		{ x: 0, y: backView.size.height - 1 },
		`Part 2 : -`
	)

	dijkstra(createKeyFromPosition({ x: 0, y: 0 }), canGo2, a => {
		const pos = extractPositionFromKey(a.current.name)

		mapView = setChar(mapView, pos, "+")
		timeViews.push(mergeView(backView, mapView, { x: 0, y: 0 }))
	})

	iterator(mapView, (pos, str) => {
		if (str === "+") {
			mapView = setChar(mapView, pos, " ")
			timeViews.push(mergeView(backView, mapView, { x: 0, y: 0 }))
		}
	})

	iterator(mapView, (pos, str) => {
		if (str === "@") {
			mapView = setChar(mapView, pos, " ")
			timeViews.push(mergeView(backView, mapView, { x: 0, y: 0 }))
		}
	})

	iterator(mapView, (pos, str) => {
		if (str !== " " && str) {
			mapView = setChar(mapView, pos, "X")
			timeViews.push(
				setChar(
					mergeView(backView, mapView, { x: 0, y: 0 }),
					{ x: 0, y: backView.size.height - 1 },
					`Part 2 : ${mapView.value.match(/x/gi).length}`
				)
			)
		}
	})

	return timeViews
}
