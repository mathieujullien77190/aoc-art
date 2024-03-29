/** @format */

import { input } from "_games/data/day14"
import { createArray, extractTab2 } from "_games/helpers/utils"
import { createView, mergeView, areEqual, clipView } from "_games/helpers/view"
import { Boundary } from "_games/helpers/types"

export const clipSize = 38

const createBackground = (boundary: Boundary): string[][] => {
	const { xMin, xMax, yMax } = boundary

	const back = createArray(yMax).map(() =>
		createArray(xMax - xMin + 1).map(() => " ")
	)
	return [...back, createArray(xMax - xMin + 1).map(() => "T")]
}

const setBackground = (back, pos, letter) => {
	back[pos.y][pos.x] = letter
}

const setblock = (back, pos) => {
	setBackground(back, { x: pos.X, y: pos.Y }, "#")
}

const setSand = (back, pos) => {
	setBackground(back, pos, "o")
}

const calcDirection = max => ({ x: max.x < 0 ? -1 : 1, p: max.p < 0 ? -1 : 1 })

const fall = (back, pos) => {
	if (back[pos.y + 1][pos.x] === " ") return { y: pos.y + 1, x: pos.x }
	if (back[pos.y + 1][pos.x - 1] === " ") return { y: pos.y + 1, x: pos.x - 1 }
	if (back[pos.y + 1][pos.x + 1] === " ") return { y: pos.y + 1, x: pos.x + 1 }

	if (back[pos.y + 1][pos.x] === "T") return true
	if (back[pos.y + 1][pos.x - 1] === "T") return true
	if (back[pos.y + 1][pos.x + 1] === "T") return true
	return false
}

const construct = (data, boundary) => {
	let xSave, prev, pos, curr, direction, max
	const back = createBackground(boundary)

	max = { x: 0, y: 0 }

	data.forEach((path, j) => {
		xSave = path[0].x
		for (let i = 1; i < path.length; i++) {
			curr = path[i]
			prev = path[i - 1]
			pos = { x: xSave, y: prev.p }
			max.x = curr.x - prev.x
			for (let x = 0; x < Math.abs(max.x) + 1; x++) {
				max.p = curr.p - prev.p
				direction = calcDirection(max)
				const X = pos.x + x * direction.x - boundary.xMin

				for (let p = 0; p < Math.abs(max.p) + 1; p++) {
					const Y = pos.y + p * direction.p
					setblock(back, { X, Y })
				}
				xSave = pos.x + x * direction.x
			}
		}
	})
	return back
}

const sand1 = (back, start, boundary, cb, cbEnd) => {
	let f, F
	const { xMin } = boundary
	const posStart = { y: start.y, x: start.x - xMin }

	do {
		f = { ...posStart }
		F = { ...f }
		do {
			f = { ...F }
			F = fall(back, f)
			if (F !== false && F !== true) cb(F)
		} while (F !== false && F !== true)
		setSand(back, f)
		cbEnd(f)
	} while (F !== true)
}

export const generateViews = () => {
	const data = extractTab2(input, "\n", " -> ").map(line =>
		line.map(coord => {
			const xp = coord.split(",")
			return { x: +xp[0], p: +xp[1] }
		})
	)

	const boundary = { xMin: 464, xMax: 537, yMin: 0, yMax: 179 }
	const views = []
	const start = { x: 500, y: 0 }

	let posClip = { x: start.x - boundary.xMin, y: 12 }

	const back = construct(data, boundary)

	const sandView = { value: "o", size: { width: 1, height: 1 } }

	let backView = mergeView(
		createView(back, false),
		{ value: "V", size: { width: 1, height: 1 } },
		{ x: start.x - boundary.xMin, y: 0 }
	)

	views.push(clipView(backView, posClip, clipSize, " "))

	sand1(
		back,
		start,
		boundary,
		pos => {
			const sandMergeView = mergeView(backView, sandView, pos)

			const sandMergeClip = clipView(sandMergeView, posClip, clipSize, " ")

			if (!areEqual(sandMergeClip, views[views.length - 1])) {
				views.push(sandMergeClip)
			}
		},
		pos => {
			backView = mergeView(backView, sandView, pos)
			posClip.y = pos.y > posClip.y ? posClip.y + 1 : posClip.y
		}
	)

	return views
}
