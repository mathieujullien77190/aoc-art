/** @format */
import { input } from "_games/data/day8"

import { View, ViewPlan, Position } from "_games/helpers/types"
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
	createEmptyViewPlanFromString,
	searchCharPlan,
} from "_games/helpers/viewPlan"

type Node = { start: string; L: string; R: string }
type NodesMap = Record<string, { L: string; R: string }>

const extractData = (): string[][] => {
	return input
		.replace(/[() ]*/gi, "")
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
	cb: (node: string) => void
) => {
	let i = 0
	let currentNode = "AAA"

	for (; currentNode !== "ZZZ"; i++) {
		currentNode = nodesMap[currentNode][directions[i % directions.length]]
		cb(currentNode)
	}
}

const highlight = (view: View, node: string) => {
	const position = searchChar(view, node)
	view = setChar(view, position, "###")

	return view
}

const data = extractData()
const nodes = extractNodes(data)
const nodesMap = extractNodesMap(nodes)
const directions = data[0][0]

export const init = (): ViewPlan[] => {
	const text = "Map of desert"

	const txtMap = createTxtMap(nodes)
	const baseView = createView(txtMap)
	const baseViewPlan = createEmptyViewPlanFromString([baseView.value], {
		text,
	})

	let all = []

	console.log(highlight(baseView, "AAA").value)

	nextNode(nodesMap, directions, a => {
		const copy = copyViewPlan(baseViewPlan)
		copy.value[0] = highlight(baseView, a).value
		all.push(copy)
	})

	return all
}
