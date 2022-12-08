/** @format */
import { input, octopus } from "../data/octopus"
import { extractTab2, getNeighbours, copy, arr2DForEach } from "../helpers"

const data = extractTab2(input, "\n", "").map(item => item.map(item2 => +item2))

const addOne = arr => {
	return arr.map(item => item.map(item2 => item2 + 1))
}

const resetFlash = arr => {
	return arr.map(item => item.map(item2 => (item2 === -1 ? 0 : item2)))
}

const highlight = (arr, lineI, columnI) => {
	const matrix = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	]
	let copyArr = copy(arr)
	const N = getNeighbours(copyArr, lineI, columnI, matrix)

	N.forEach(({ lineI, columnI }) => {
		copyArr[lineI][columnI] =
			copyArr[lineI][columnI] === -1 ? -1 : copyArr[lineI][columnI] + 1
	})
	copyArr[lineI][columnI] = -1

	return copyArr
}

const highlightAll = arr => {
	let copyArr = copy(arr)

	arr2DForEach(copyArr, ({ item, indexLine, indexColumn }) => {
		if (item > 9) {
			copyArr = highlight(copyArr, indexLine, indexColumn)
		}
	})

	return copyArr
}

const verif = arr => {
	return (
		arr
			.map(item => item.filter(item2 => item2 > 9).length >= 1)
			.filter(item => item).length >= 1
	)
}

export const generateViews = () => {
	let nbFlash = 0
	let data2 = copy(data)
	let save = []

	for (let i = 0; i < 234; i++) {
		save.push({ arr: copy(data2), step: i, nbFlash })
		do {
			data2 = highlightAll(data2)
			save.push({ arr: copy(data2), step: i, nbFlash })
		} while (verif(data2))

		data2 = resetFlash(data2)
		save.push({ arr: copy(data2), step: i, nbFlash })
		data2 = addOne(data2)
	}

	const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
		item => `rgb(${item * 24 + 0} ${item * 24 + 0} ${item * 24 + 0})`
	)

	return save.map(item => {
		const style =
			"width:50px;height:70px;margin:0;font-size: 10px;display: inline-flex;font-weight:bold;"
		return {
			value: item.arr
				.map((item2, i) =>
					item2
						.map((item3, j) => {
							if (item3 === -1)
								return `<pre  style="${style}color:yellow;">${octopus}</pre>`
							if (item3 > 9)
								return `<pre style="${style}color:${colors[item3]};">${octopus}</pre>`
							if (item3 === 0)
								return `<pre  style="${style}color:${colors[item3]};">${octopus}</pre>`
							return `<pre style="${style}color:${colors[item3]};">${octopus}</pre>`
						})
						.join("")
				)
				.join("\n"),
		}
	})
}
