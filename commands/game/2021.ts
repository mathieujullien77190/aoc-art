/** @format */

import { data as baseData } from "../data/2021"
import { copy, extractTab2 } from "./helpers"

var data = extractTab2(baseData, "\n", "")

const nextCase = (data, indexLine, indexColumn) => {
	const cc = data[indexLine][indexColumn]
	if (cc === ">") {
		const newIndexColumn =
			indexColumn + 1 >= data[0].length ? 0 : indexColumn + 1
		if (data[indexLine][newIndexColumn] === ".")
			return { x: newIndexColumn, y: indexLine }
		return { y: indexLine, x: indexColumn }
	}
	if (cc === "v") {
		const newIndexLine = indexLine + 1 >= data.length ? 0 : indexLine + 1
		if (data[newIndexLine][indexColumn] === ".")
			return { x: indexColumn, y: newIndexLine }
		return { y: indexLine, x: indexColumn }
	}
}

const step = (data, type) => {
	let data2 = copy(data)
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[0].length; j++) {
			if (data[i][j] === type) {
				const next = nextCase(data, i, j)
				data2[i][j] = "."
				data2[next.y][next.x] = type
			}
		}
	}
	return data2
}

const read = (arr, timeStep, fn) => {
	const timer = window.setInterval(
		initTime => {
			const index =
				parseInt(
					((new Date().getTime() - initTime) / timeStep).toString(),
					10
				) - 1
			if (arr[index]) fn.call(this, arr[index], timer)
			else clearInterval(timer)
		},
		timeStep,
		new Date().getTime()
	)
}

var data2, save2, element
var count = 0
var ex = false
var save = [copy(data)]

do {
	data2 = copy(data)
	data = step(data, ">")
	save.push(copy(data))
	data = step(data, "v")
	save.push(copy(data))
	count++

	if (JSON.stringify(data2) === JSON.stringify(data)) ex = true
} while (ex === false)

save2 = save.map(screen =>
	screen
		.map(item => item.map(item2 => (item2 === "." ? " " : item2)).join(""))
		.join("\n")
)

document.body.innerHTML = '<pre id="container"></pre>'

element = document.body.querySelector("#container")
element.style.fontSize = "10px"
element.style.lineHeight = "6px"

read(save2, 20, item => {
	element.innerHTML = item
})
