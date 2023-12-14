/** @format */
import { input } from "_games/data/day142"
import { extractTab2 } from "../helpers/utils"
import { ViewPlan } from "_games/helpers/types"

import {
	copyViewPlan,
	createEmptyViewPlanFromString,
} from "_games/helpers/viewPlan"

const extractData = (): string[][] =>
	extractTab2(input.replace(/\./g, " ").replace(/O/g, "o"), "\n", "")

const pushNorth = (data: string[][], cb: (data) => void) => {
	let action = true
	let o, p
	while (action) {
		action = false
		cb(data)
		for (let i = 0; i < data[0].length; i++) {
			for (let j = 0; j < data.length - 1; j++) {
				o = data[j][i]
				p = data[j + 1][i]
				if (o == " " && p == "o") {
					data[j][i] = p
					data[j + 1][i] = " "
					action = true
				}
			}
		}
	}
}

const pushSouth = (data: string[][], cb: (data) => void) => {
	let action = true
	let o, p
	while (action) {
		action = false
		cb(data)
		for (let i = 0; i < data[0].length; i++) {
			for (let j = data.length - 1; j > 0; j--) {
				o = data[j][i]
				p = data[j - 1][i]
				if (o == " " && p == "o") {
					data[j][i] = p
					data[j - 1][i] = " "
					action = true
				}
			}
		}
	}
}

const pushWest = (data: string[][], cb: (data) => void) => {
	let action = true
	let o, p
	while (action) {
		action = false
		cb(data)
		for (let j = 0; j < data.length - 1; j++) {
			for (let i = 0; i < data[0].length; i++) {
				o = data[i][j]
				p = data[i][j + 1]
				if (o == " " && p == "o") {
					data[i][j] = p
					data[i][j + 1] = " "
					action = true
				}
			}
		}
	}
}

const pushEast = (data: string[][], cb: (data) => void) => {
	let action = true
	let o, p
	while (action) {
		action = false
		cb(data)
		for (let j = data.length - 1; j > 0; j--) {
			for (let i = 0; i < data[0].length; i++) {
				o = data[i][j]
				p = data[i][j - 1]
				if (o == " " && p == "o") {
					data[i][j] = p
					data[i][j - 1] = " "
					action = true
				}
			}
		}
	}
}

const data = extractData()

export const init = (): ViewPlan[] => {
	let all = []
	let copy

	const base = createEmptyViewPlanFromString([input])

	let stop = 0
	while (stop < 25) {
		pushNorth(data, d => {
			copy = copyViewPlan(base)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "north" }
			all.push(copy)
		})
		pushWest(data, d => {
			copy = copyViewPlan(base)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "west" }
			all.push(copy)
		})
		pushSouth(data, d => {
			copy = copyViewPlan(base)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "south" }
			all.push(copy)
		})
		pushEast(data, d => {
			copy = copyViewPlan(base)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "east" }
			all.push(copy)
		})
		stop++
	}

	return all
}
