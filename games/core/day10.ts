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
	copyView,
} from "_games/helpers/view"

export const mapView = createView(input)

const extractPositionFromKey = (id: string): Position => {
	const arr = id.split(";")
	return { x: +arr[0], y: +arr[1] }
}

const createKeyFromPosition = (pos: Position): string => {
	return `${pos.x};${pos.y}`
}

const canGo = name => {
	const B = [0, 1]
	const T = [0, -1]
	const R = [1, 0]
	const L = [-1, 0]
	const pos = extractPositionFromKey(name)
	const value = getChar(mapView, pos)
	const SS = [
		[-1, 0],
		[0, -1],
	]

	let neighbours = getNeighbours(mapView, pos)

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
			item => item.type === "T" || item.type === "L"
		)

	const search = neighbours.map(item => ({
		name: createKeyFromPosition(item.pos),
		value: 1,
	}))
	return search
}

export const init = (mapView: View): View[] => {
	let timeViews = [mapView]
	let tempView = copyView(mapView)

	const start = searchChar(mapView, "S")

	dijkstra(createKeyFromPosition(start), canGo, a => {
		const pos = extractPositionFromKey(a.current.name)
		tempView = copyView(tempView)
		tempView = setChar(tempView, pos, "@")
		timeViews.push(tempView)
	})

	return timeViews
}
