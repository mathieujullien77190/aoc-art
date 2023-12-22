import { input2 as input } from "_games/data/day21"
import {
	searchChar,
	createView,
	getNeighbours,
	copyView,
	setChar,
} from "_games/helpers/view"
import { createEmptyViewPlanFromString } from "_games/helpers/viewPlan"
import { Position, View, ViewPlan } from "_games/helpers/types"

const extractPositionFromKey = (id: string): Position => {
	const arr = id.split(";")
	return { x: +arr[0], y: +arr[1] }
}

const createKeyFromPosition = (pos: Position) => {
	return `${pos.x};${pos.y}`
}

const searchS = (view: View): Position => {
	return searchChar(view, "S")
}

export const init = (max: number): ViewPlan[] => {
	const baseView = createView(input.replace(/[.]/g, " "))
	const baseView2 = createView(input.replace(/[.#]/g, " "))

	const S = searchS(baseView)

	let find = { [createKeyFromPosition(S)]: 1 }
	let copy = copyView(baseView)
	let all = []
	let plan = createEmptyViewPlanFromString([baseView.value, baseView2.value])

	for (let i = 0; i < max; i++) {
		let find2 = {}
		copy = copyView(baseView2)
		for (let key in find) {
			const neighbours = getNeighbours(
				baseView,
				extractPositionFromKey(key)
			).filter(({ value }) => value !== "#")

			for (let neighbour of neighbours) {
				find2[createKeyFromPosition(neighbour.pos)] = 1
			}
		}
		find = {}
		for (let neighbour in find2) {
			find[neighbour] = 1
			copy = setChar(copy, extractPositionFromKey(neighbour), "+")
		}
		all.push(createEmptyViewPlanFromString([copy.value, baseView.value]))
	}

	return all
}
