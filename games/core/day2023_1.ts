/** @format */
import { input } from "_games/data/day2023_1"
import { copy, extractTab1, createArray } from "_games/helpers/utils"
import { createView } from "_games/helpers/view"

const cut = 1000

const search = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
]

const deleteLetters = createArray(26).map((item, i) =>
	String.fromCharCode(i + 97)
)

const simplify = (str, search, trans) => {
	let res = ""
	for (let i = 0; i < str.length; i++) {
		const index = str.substr(i).indexOf(search)
		if (index === 0) res += `#${trans}#`
		res += str.substr(i, 1)
	}
	return res
}

const init = () => {
	const data = extractTab1(input.replace(/([0-9])/g, "@$1@"), "\n")
	// .filter(
	// 	(_, i) => i < cut
	// )
	// return data
	// 	.reduce((acc, curr, i) => {
	// 		acc[i % cut] = acc[i % cut] ? [...acc[i % cut], curr] : [curr]
	// 		return acc
	// 	}, [])
	// 	.map(item => item.join(" "))
	return data
}

const changeWordToNumber = (base: string[]) => {
	let views = []
	let res
	base.forEach((line, i) => {
		res = line
		search.forEach((s, j) => {
			const simple = simplify(res, s, j)
			if (res !== simple) {
				const baseView = copy(base)
				baseView[i] = simple
				views.push(baseView)
				res = simple
			}
		})
		base[i] = res
	})
	return views
}

const deleteLetter = (base: string[]) => {
	let views = []
	let line2
	let lineBis
	base.forEach((line, j) => {
		line2 = line
		for (let i = 0; i < line.length; i++) {
			for (let k = 0; k < deleteLetters.length; k++) {
				lineBis = line2.replace(new RegExp(deleteLetters[k], "g"), "")

				if (lineBis !== line2) {
					const baseView = copy(base)
					baseView[j] = lineBis
					views.push(baseView)
					line2 = lineBis
				}
			}
		}

		if (line2.length <= 3) line2 = `${line2}${line2}`
		base[j] = line2
	})

	return views
}

const deleteCenter = (base: string[]) => {
	let views = []
	let line2
	base.forEach((line, j) => {
		line2 = line

		while (line2.length > 6) {
			line2 = line2.substr(0, 3) + line2.substr(6)
			const baseView = copy(base)
			baseView[j] = line2
			views.push(baseView)
		}

		base[j] = "~" + line2.replace(/[#@]/g, "") + "~"
	})
	views.push(base)
	return views
}

const sum = (base: string[]) => {
	let views = []
	let baseView = copy(base)

	base.reduce((acc, curr, i) => {
		acc += parseInt(curr.replace(/~/g, ""))
		baseView[0] = acc
		views.push(baseView.filter((item, j) => j === 0 || j > i))
		return acc
	}, 0)

	return views
}

export const generateViews = () => {
	const start = init()

	const next1 = changeWordToNumber(start)

	const next2 = deleteLetter(copy(next1.at(-1)))

	const next3 = deleteCenter(copy(next2.at(-1)))

	const next4 = sum(next3.at(-1))

	return [
		createView(start.join("\n")),
		...next1.map(item => createView(item.join("\n"))),
		...next2.map(item => createView(item.join("\n"))),
		...next3.map(item => createView(item.join("\n"))),
		...next4.map(item => createView(item.join("\n"))),
	]
}
