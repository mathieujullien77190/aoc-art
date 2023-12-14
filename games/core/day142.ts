/** @format */
import { input } from "_games/data/day142"
import { ViewPlan } from "_games/helpers/types"
import { createArray } from "_games/helpers/utils"
import {
	createEmptyView,
	setChar,
	copyView,
	createView,
} from "_games/helpers/view"
import {
	copyViewPlan,
	createEmptyViewPlanFromString,
} from "_games/helpers/viewPlan"

const extractData = (size: number): string[][] => {
	const cleanInput = input.replace(/\./g, " ").replace(/O/g, "o")
	const lines = cleanInput.split("\n")
	let data = []

	for (let i = 0; i < size; i++) {
		data[i] = []
		for (let j = 0; j < size; j++) {
			data[i].push(lines[i][j])
		}
	}

	return data
}

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

export const init = (size): ViewPlan[] => {
	let all = []
	let copy, a

	const data = extractData(size)

	let base = createEmptyView({ width: size, height: size })
	copy = createEmptyViewPlanFromString([base.value])

	for (a = 0; a < 100; a++) {
		pushNorth(data, d => {
			copy = copyViewPlan(copy)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "north" }
			all.push(copy)
		})
		pushWest(data, d => {
			copy = copyViewPlan(copy)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "west" }
			all.push(copy)
		})
		pushSouth(data, d => {
			copy = copyViewPlan(copy)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "south" }
			all.push(copy)
		})
		pushEast(data, d => {
			copy = copyViewPlan(copy)
			copy.value[0] = d.map(line => line.join("")).join("\n")
			copy.meta = { text: "east" }
			all.push(copy)
		})
	}

	console.log("salut")

	return all
}
