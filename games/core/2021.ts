import { input, subMarine0 } from "_games/data/2021"
import { createView, mergeView } from "_games/helpers/view"
import { View, Position } from "_games/helpers/types"
import { arr2DForEach, getNeighbours } from "_games/helpers/utils"

type Meta = { old: Position; new: Position }[]

const move = (data: string[][], meta: Meta): View => {
	meta.forEach(item => {
		const str = data[item.old.y][item.old.x]
		data[item.old.y][item.old.x] = " "
		data[item.new.y][item.new.x] = str
	})
	return createView(data)
}

const test = (data: string[][], type: ">" | "v") => {
	let meta = []
	arr2DForEach(data, ({ indexLine, indexColumn, item }) => {
		if (item === type) {
			const res = getNeighbours(
				data,
				indexLine,
				indexColumn,
				type === ">" ? [[0, 1]] : [[1, 0]],
				true
			)
			if (res[0]?.obj === " ") {
				meta.push({
					old: { x: indexColumn, y: indexLine },
					new: { x: res[0]?.columnI, y: res[0]?.lineI },
				})
			}
		}
	})
	return meta
}

const canMove = (arr: Meta): boolean => arr.length > 0

const createArr = (input: string): string[][] =>
	input.split("\n").map(item => item.split(""))

export const generateViews = (): View[] => {
	let view = createView(input.replace(/\./gi, " "))
	let data = createArr(input)

	let meta = []
	let next1 = true
	let next2 = true
	let views: View[] = []

	do {
		data = createArr(view.value)

		meta = test(data, ">")
		next1 = canMove(meta)
		if (next1) {
			view = move(data, meta)
			views.push(view)
			data = createArr(view.value)
		}

		meta = test(data, "v")
		next2 = canMove(meta)
		if (next2) {
			view = move(data, meta)
			views.push(view)
			data = createArr(view.value)
		}
	} while (next1 || next2)

	const baseView = views.at(-1)
	const subMarineView = createView(subMarine0, true)

	const startX = 0
	const startY = 11
	for (let i = 0; i < baseView.size.height; i++) {
		view = mergeView(baseView, subMarineView, {
			x: startX + i,
			y: startY + i,
		})
		views.push(view)
		views.push(view)
		views.push(view)
	}

	return views
}
