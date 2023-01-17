/** @format */
import { input } from "_games/data/day12"

import { View, ViewPlan, Position } from "_games/helpers/types"
import { findBestPath, ElementGraph } from "_games/helpers/graph"
import {
	createView,
	getNeighbours,
	getChar,
	setChar,
	searchChar,
	iterator,
} from "_games/helpers/view"
import {
	copyViewPlan,
	createEmptyViewPlan,
	extractView,
} from "_games/helpers/viewPlan"
import { getCode } from "_games/helpers/string"

type StartEnd = { start: string; end: string }

const startChar = "`"
const endChar = "{"

export const mapView = createView(
	input.replace("S", startChar).replace("E", endChar),
	false
)

const extractPositionFromKey = (id: string): Position => {
	const arr = id.split(";")
	return { x: +arr[0], y: +arr[1] }
}

const createKeyFromPosition = (pos: Position): string => {
	return `${pos.x};${pos.y}`
}

const canGo = name => {
	const currentPos = extractPositionFromKey(name)
	const current = getChar(mapView, currentPos)
	const search = getNeighbours(mapView, extractPositionFromKey(name))
		.filter(item => getCode(getChar(mapView, item.pos)) <= getCode(current) + 1)
		.map(item => ({
			name: createKeyFromPosition(item.pos),
			value: 1,
		}))
	return search
}

const renderChar = (
	baseChar: string,
	replaceChar: string,
	startChar: string,
	endChar: string
) => {
	return baseChar === startChar || baseChar === endChar ? "@" : replaceChar
}

export const getLettersPlan = (
	mapView: View,
	plans: ViewPlan,
	maxWidth: number,
	startEnd: StartEnd
): ViewPlan => {
	const min = getCode(startEnd.start)

	iterator(
		mapView,
		pos => {
			const str = getChar(mapView, pos)

			plans.value[0] = setChar(
				extractView(plans, 0),
				pos,
				renderChar(str, str, startEnd.start, startEnd.end)
			).value
		},
		{ x: pos => pos.x < maxWidth, y: pos => pos.y < maxWidth }
	)

	return plans
}

export const getElevationPlan = (
	mapView: View,
	plans: ViewPlan,
	alt: number,
	startEnd: StartEnd
): ViewPlan => {
	const min = getCode(startEnd.start)

	iterator(mapView, pos => {
		const str = getChar(mapView, pos)
		const altStr = getCode(str) - min

		plans.value[altStr > alt ? alt : altStr] = setChar(
			extractView(plans, altStr > alt ? alt : altStr),
			pos,
			renderChar(str, str, startEnd.start, startEnd.end)
		).value
	})

	return plans
}

export const getNormalPlan = (
	mapView: View,
	plans: ViewPlan,
	startEnd: StartEnd
): ViewPlan => {
	const min = getCode(startEnd.start)

	iterator(mapView, pos => {
		const str = getChar(mapView, pos)
		const alt = getCode(str) - min

		plans.value[alt] = setChar(
			extractView(plans, alt),
			pos,
			renderChar(str, "#", startEnd.start, startEnd.end)
		).value
	})

	return plans
}

export const updateAllPlan = (
	mapView: View,
	plans: ViewPlan,
	startEnd: StartEnd,
	current: ElementGraph,
	strReplace: string
): ViewPlan => {
	const min = getCode(startEnd.start)

	const pos = extractPositionFromKey(current.name)
	const str = getChar(mapView, pos)
	const alt = getCode(str) - min

	plans.value[alt] = setChar(
		extractView(plans, alt),
		pos,
		renderChar(str, strReplace, startEnd.start, startEnd.end)
	).value

	return plans
}

export const init = (mapView: View): ViewPlan[] => {
	const start = searchChar(mapView, startChar)
	const end = searchChar(mapView, endChar)

	const min = getCode(startChar)
	const max = getCode(endChar)
	const altitudeMax = max - min + 1

	const startEnd = { start: startChar, end: endChar }

	let timePlans = []

	const basePlans = createEmptyViewPlan(mapView.size, altitudeMax)

	for (let i = 0; i < mapView.size.width; i++) {
		const text = `Construction de la carte ( taille : ${
			(i < mapView.size.height ? i : mapView.size.height) * i
		})`
		timePlans.push(
			getLettersPlan(mapView, copyViewPlan(basePlans, { text }), i, startEnd)
		)
	}

	for (let i = 0; i < altitudeMax; i++) {
		const text = `Construction de la carte ( altitude max : ${i} )`
		timePlans.push(
			getElevationPlan(mapView, copyViewPlan(basePlans, { text }), i, startEnd)
		)
	}

	let startPlan = getElevationPlan(
		mapView,
		copyViewPlan(basePlans),
		altitudeMax - 1,
		startEnd
	)

	const res = findBestPath(
		createKeyFromPosition(start),
		createKeyFromPosition(end),
		canGo,
		({ current, index }) => {
			const text = `Exécution de l'algorithme de Dijkstra ( noeuds : ${index} )`
			startPlan = updateAllPlan(
				mapView,
				copyViewPlan(startPlan, { text }),
				startEnd,
				current,
				"#"
			)
			if (index % 20 === 0) {
				timePlans.push(startPlan)
			}
		}
	)

	let middlePlan = getNormalPlan(mapView, copyViewPlan(basePlans), startEnd)

	for (let i = 0; i < res.length; i++) {
		const text = `Extraction du chemin le plus court ( distance : ${i} )`
		middlePlan = updateAllPlan(
			mapView,
			copyViewPlan(middlePlan, { text }),
			startEnd,
			res[i],
			"@"
		)
		timePlans.push(updateAllPlan(mapView, middlePlan, startEnd, res[i], "@"))
	}

	return timePlans
}
