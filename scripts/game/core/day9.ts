/** @format */

import { input } from "../data/day9"
import { createArray, extractTab2 } from "../helpers"
import { createView, mergeView, mergeViews, Position } from "../view"

const distance = (p1, p2) => {
	const X = Math.abs(p1.x - p2.x)
	const Y = Math.abs(p1.y - p2.y)

	if (X > 1 && Y === 0) return { x: p1.x > p2.x ? 1 : -1, y: 0 }
	if (Y > 1 && X === 0) return { y: p1.y > p2.y ? 1 : -1, x: 0 }
	if (X + Y >= 3)
		return {
			x: p1.x - p2.x > 0 ? 1 : -1,
			y: p1.y - p2.y > 0 ? 1 : -1,
		}

	return null
}

const movePosition = (p, x, y) => ({ x: p.x + x, y: p.y + y })

const movePositionHead = (p, move) =>
	({
		R: { x: p.x + 1, y: p.y },
		U: { y: p.y - 1, x: p.x },
		L: { x: p.x - 1, y: p.y },
		D: { y: p.y + 1, x: p.x },
	}[move.direction])

const init = (data, nb) => {
	let positionH = { x: 0, y: 0 }
	let positionT = createArray(nb).map(item => positionH)

	return data.reduce((acc, move) => {
		for (let i = 1; i <= move.value; i++) {
			positionH = movePositionHead(positionH, move)

			for (let j = 0; j < nb; j++) {
				const distanceV = distance(
					j - 1 < 0 ? positionH : positionT[j - 1],
					positionT[j]
				)
				if (distanceV) {
					positionT[j] = movePosition(positionT[j], distanceV.x, distanceV.y)
				}
			}
			acc.push([positionH, ...positionT])
		}

		return acc
	}, [])
}

export const generateViews = (dataSize: number, size: number) => {
	const data = extractTab2(input, "\n", " ")
		.map(([d, v]) => ({
			direction: d,
			value: +v,
		}))
		.filter((_, i, tab) => i < Math.floor((tab.length * dataSize) / 100))

	const positions = init(data, size)
	const X = positions.map(group => group.map(coord => coord.x)).flat()
	const Y = positions.map(group => group.map(coord => coord.y)).flat()

	const minX = Math.min(...X)
	const minY = Math.min(...Y)
	const maxX = Math.max(...X) + Math.abs(minX) + 2
	const maxY = Math.max(...Y) + Math.abs(minY) + 2

	let back = createView(
		createArray(maxY).map(() => createArray(maxX).map(() => " ")),
		false
	)
	let trace = createView(".", false)
	let snake = createView("#", false)
	let head = createView("%", false)
	let back2

	return positions.map((group: Position[]) => {
		back = mergeView(back, trace, {
			x: group[size].x + Math.abs(minX) + 1,
			y: group[size].y + Math.abs(minY) + 1,
		})
		back2 = { ...back }

		return mergeViews(
			back2,
			group.map(({ x, y }, i) => {
				return {
					view: i === 0 ? head : snake,
					position: { y: y + Math.abs(minY) + 1, x: x + Math.abs(minX) + 1 },
				}
			})
		)
	})
}
