/** @format */
import { input, camel, mountain } from "_games/data/day8"
import { rand } from "../helpers/math"
import { createArray } from "../helpers/utils"
import { View, ViewPlan } from "_games/helpers/types"
import {
	createView,
	setChar,
	searchChar,
	mergeView,
	createEmptyView,
} from "_games/helpers/view"
import {
	copyViewPlan,
	createEmptyViewPlanFromString,
} from "_games/helpers/viewPlan"

type Node = { start: string; L: string; R: string }
type NodesMap = Record<string, { L: string; R: string }>

const extractData = (): string[][] => {
	return input
		.replace(/[() ]*/gi, "")
		.replace(/X/gi, "0")
		.split("\n\n")
		.map(g => g.split("\n"))
}

const extractNodes = (data: string[][]): Node[] => {
	return data[1].map(line => {
		const group = line.split(/[,=]/gi)
		return {
			start: group[0],
			L: group[1],
			R: group[2],
		}
	})
}

const extractNodesMap = (nodes: Node[]): NodesMap => {
	return nodes.reduce(
		(acc, { start, L, R }) => ({ ...acc, [start]: { L, R } }),
		{}
	)
}

const createTxtMap = (nodes: Node[]): string => {
	let txt = ""
	for (let i = 0; i < nodes.length; i++) {
		if (i % 18 === 0 && i !== 0) txt += "\n"
		txt += nodes[i].start + " "
	}

	return txt
}

const nextNode = (
	nodesMap: NodesMap,
	directions: string,
	cb: (node: string, index: number) => void
) => {
	let i = 0
	let currentNode = "AAA"

	for (; currentNode !== "ZZZ"; i++) {
		currentNode = nodesMap[currentNode][directions[i % directions.length]]
		cb(currentNode, i + 1)
	}
}

const highlight = (view: View, node: string) => {
	const position = searchChar(view, node)
	view = setChar(view, position, "###")

	return { view, position }
}

const randomPointsView = (view: View): string => {
	let txt = ""
	for (let i = 0; i < view.value.length; i++) {
		if (view.value[i] !== "\n") {
			txt += rand(0, 5) === 0 ? "." : " "
		} else {
			txt += "\n"
		}
	}
	return txt
}

const data = extractData()
const nodes = extractNodes(data)
const nodesMap = extractNodesMap(nodes)
const directions = data[0][0]

export const init = (): ViewPlan[] => {
	const width = 18 * 4
	const height = 41
	const WIDTH = width + 20
	const HEIGHT = height + 20
	const DEC = 10
	const TEMPEST_HEIGHT = 6

	const camelView = createView(camel, true)
	const mountainView = createView(mountain, true)

	const txtMap = createTxtMap(nodes)
	const frontView = createView(txtMap)
	const backView = createEmptyView({ width: WIDTH, height: HEIGHT })
	const backView2 = createEmptyView({ width: width, height: height })

	const tempest = createArray(TEMPEST_HEIGHT * 5).map(() =>
		randomPointsView(backView2)
	)

	const baseView = mergeView(backView, frontView, { x: DEC, y: DEC })
	const baseViewPlan = createEmptyViewPlanFromString([baseView.value], {})

	let all = []
	let i = 0
	let copy, copy2

	nextNode(nodesMap, directions, (a, index) => {
		copy = copyViewPlan(baseViewPlan)
		const calc = highlight(baseView, a)
		copy.value[0] = calc.view.value
		copy.value[1] = mergeView(backView, camelView, {
			x: Math.floor(calc.position.x - camelView.size.width / 2) + 3,
			y: Math.floor(HEIGHT / 2 - camelView.size.height),
		}).value
		copy.value[2] = mergeView(backView, mountainView, {
			x: 6,
			y: Math.floor(HEIGHT / 2 - mountainView.size.height),
		}).value

		for (let j = 0; j < TEMPEST_HEIGHT; j++) {
			copy.value.push(tempest[rand(0, TEMPEST_HEIGHT * 5 - 1)])
		}

		copy.meta = {
			y: (-(Math.floor(height / 2) - (calc.position.y - DEC))).toString(),
			index: index.toString(),
		}
		all.push(copy)

		for (let j = 0; j < rand(0, 15); j++) {
			copy2 = copyViewPlan(copy)
			for (let j = 0; j < TEMPEST_HEIGHT; j++) {
				copy2.value[3 + j] = tempest[rand(0, TEMPEST_HEIGHT * 5 - 1)]
			}
			all.push(copy2)
		}

		i++
	})

	return all
}
