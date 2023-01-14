/** @format */
import { input } from "_games/data/day12"

import { View, ViewPlan, Position } from "_games/helpers/types"
import { findBestPath } from "_games/helpers/graph"
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
	alt: number,
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
		{ x: x => x < maxWidth, y: y => y < maxWidth }
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

export const updateAllPlan = <T>(
	mapView: View,
	plans: ViewPlan,
	startEnd: StartEnd,
	list: Record<string, T>,
	strReplace: string
): ViewPlan => {
	const min = getCode(startEnd.start)

	for (let key in list) {
		const pos = extractPositionFromKey(key)
		const str = getChar(mapView, pos)
		const alt = getCode(str) - min

		plans.value[alt] = setChar(
			extractView(plans, alt),
			pos,
			renderChar(str, strReplace, startEnd.start, startEnd.end)
		).value
	}

	return plans
}

const cView = (
	plans: ViewPlan,
	text: string
): { plans: ViewPlan; meta: string } => ({ plans, meta: text })

export const init = (mapView: View): { plans: ViewPlan; meta: string }[] => {
	const start = searchChar(mapView, startChar)
	const end = searchChar(mapView, endChar)

	const min = getCode(startChar)
	const max = getCode(endChar)
	const altitudeMax = max - min + 1

	const startEnd = { start: startChar, end: endChar }

	let timePlans = []

	const basePlans = createEmptyViewPlan(
		{ width: mapView.width, height: mapView.height },
		altitudeMax
	)

	for (let i = 0; i < mapView.width; i++) {
		const text = `Construction de la carte ( taille : ${
			(i < mapView.height ? i : mapView.height) * i
		})`
		const z = altitudeMax - 1
		timePlans.push(
			cView(
				getLettersPlan(mapView, copyViewPlan(basePlans), i, z, startEnd),
				text
			)
		)
	}

	for (let i = 0; i < altitudeMax; i++) {
		const text = `Construction de la carte ( altitude max : ${i} )`
		timePlans.push(
			cView(
				getElevationPlan(mapView, copyViewPlan(basePlans), i, startEnd),
				text
			)
		)
	}

	const startPlan = getElevationPlan(
		mapView,
		copyViewPlan(basePlans),
		altitudeMax - 1,
		startEnd
	)

	const res = findBestPath(
		createKeyFromPosition(start),
		createKeyFromPosition(end),
		canGo,
		(list, index) => {
			if (index % 20 === 0) {
				const text = `Exécution de l'algorithme de Dijkstra ( noeuds : ${
					Object.values(list).length
				} )`

				timePlans.push(
					cView(
						updateAllPlan(
							mapView,
							copyViewPlan(startPlan),
							startEnd,
							list,
							"#"
						),
						text
					)
				)
			}
		}
	)

	const middlePlan = getNormalPlan(mapView, copyViewPlan(basePlans), startEnd)

	for (let i = 0; i < res.length; i++) {
		const list = res.reduce((acc, curr, j) => {
			if (j <= i) acc[curr] = true
			return acc
		}, {})
		const text = `Extraction du chemin le plus court ( distance : ${i + 1} )`

		timePlans.push(
			cView(
				updateAllPlan(mapView, copyViewPlan(middlePlan), startEnd, list, "@"),
				text
			)
		)
	}

	return timePlans
}
