/** @format */
import { input } from "_games/data/day4"
import { extractTab3Int, createArray } from "_games/helpers/utils"

const getViews = (size, view) => {
	let views = []
	let filter
	let k
	let tot = 0
	for (let i = 0; i < Math.max(view.length - size, 1); i++) {
		k = 0
		while (k < view[i].length && view[i][k - 1 < 0 ? 0 : k - 1] !== "#") {
			filter = view.filter((_, j) => j < i + size && j >= i)
			filter[0] = filter[0].map((item, l) => {
				if (l === k) {
					if (item === "#") tot++
					return `<span style="font-size:24px;font-weight:bold;">[${item}]</span>`
				}
				return item
			})
			views.push([...filter.map(item => item.join("")), "Total : " + tot])
			k++
		}
	}
	return views
}

export const generateViews = (size: number, dataSize: number) => {
	const output = extractTab3Int(input, "\n", ",", "-")
		.filter((_, i, tab) => i < Math.floor((tab.length * dataSize) / 100))
		.map((line, i) => {
			const p1 = createArray(line[0][1] - line[0][0] + 1).map(
				(_, i) => i + line[0][0]
			)
			const p2 = createArray(line[1][1] - line[1][0] + 1).map(
				(_, i) => i + line[1][0]
			)

			const max = Math.max(...line[0], ...line[1])
			const base = createArray(max + 1)
			const base1 = base.map((item, i) => (p1.includes(i) ? "?" : " "))
			const base2 = base1.map((item, i) =>
				p2.includes(i) && item !== "?" ? "!" : item
			)
			const base3 = base2.map((item, i) =>
				p2.includes(i) && p1.includes(i) ? "#" : item
			)
			return base3
		})

	const output2 = [...output, ...createArray(size).map(item => [" "])]

	return getViews(size, output2).map(view => ({
		value: view
			.map(line =>
				line
					.replace(/(\?+)/g, '<span style="color:red">$1</span>')
					.replace(/(\!+)/g, '<span style="color:yellow">$1</span>')
					.replace(/(\#+)/g, '<span style="color:orange">$1</span>')
					.replace(/[\?\!\#]/g, "#")
			)
			.join("\n"),
	}))
}
