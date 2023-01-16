/** @format */
import { input, input2 } from "_games/data/day15"

import { View, ViewPlan, Position } from "_games/helpers/types"
import { findBestPath } from "_games/helpers/graph"
import {
	createView,
	getNeighbours,
	getChar,
	setChar,
	searchChar,
	iterator,
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
	const search = getNeighbours(mapView, extractPositionFromKey(name)).map(
		item => ({
			name: createKeyFromPosition(item.pos),
			value: +item.value,
		})
	)
	return search
}

export const init = (mapView: View): View[] => {
	let timeViews = []
	let tempView = copyView(mapView)

	const start = { x: 0, y: 0 }
	const end = { x: mapView.size.width - 1, y: mapView.size.height - 1 }

	const res = findBestPath(
		createKeyFromPosition(start),
		createKeyFromPosition(end),
		canGo
	)

	let tot = 0
	for (let i = 0; i < res.length; i++) {
		const pos = extractPositionFromKey(res[i].name)
		tot += +getChar(mapView, pos)
		tempView = setChar(copyView(tempView), pos, "#")
		timeViews.push(tempView)
	}

	return timeViews
}
