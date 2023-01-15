/** @format */
import { input, input2 } from "_games/data/day13"

import { extractTab2 } from "_games/helpers/utils"
import { View, Position, Boundary } from "_games/helpers/types"
import {
	createEmptyView,
	setChar,
	copyView,
	extract,
	iterator,
} from "_games/helpers/view"

type Action = { value: number; axe: string }
type Data = { positions: Position[]; actions: Action[] }

export const data: Data = extractTab2(input, "\n\n", "\n").reduce(
	(acc, curr, i) => {
		if (i === 0) {
			return {
				...acc,
				positions: curr.map(line => {
					const pos = line.split(",")
					return { x: +pos[0], y: +pos[1] }
				}),
			}
		} else {
			return {
				...acc,
				actions: curr.map(line => {
					const act = line.split("=")
					return { axe: act[0].substr(-1), value: +act[1] }
				}),
			}
		}
	},
	{ positions: [], actions: [] }
)

const addPoints = (data: Position[], view: View) => {
	let copy = copyView(view)
	data.forEach(pos => {
		copy = setChar(copy, pos, "#")
	})
	return copy
}

const separate = (view: View, action: Action): { fold1: View; fold2: View } => {
	let fold1, fold2

	fold1 = extract(
		view,
		{ x: 0, y: 0 },
		{
			width: action.axe === "y" ? view.size.width : action.value,
			height: action.axe === "y" ? action.value : view.size.height,
		}
	)
	fold2 = extract(
		view,
		{
			x: action.axe === "y" ? 0 : action.value + 1,
			y: action.axe === "y" ? action.value + 1 : 0,
		},
		view.size
	)

	return { fold1, fold2 }
}

const fold = (view: View, action: Action): View => {
	let { fold1, fold2 } = separate(view, action)

	iterator(fold2, (pos, str) => {
		if (str === "#")
			fold1 = setChar(
				fold1,
				{
					x: action.axe === "y" ? pos.x : fold1.size.width - pos.x - 1,
					y: action.axe === "y" ? fold1.size.height - pos.y - 1 : pos.y,
				},
				"#"
			)
	})

	return fold1
}

export const init = (data: Data): View[][] => {
	const boundary: Boundary = {
		xMax: Math.max(...data.positions.map(pos => pos.x)) + 1,
		yMax: Math.max(...data.positions.map(pos => pos.y)) + 1,
		yMin: 0,
		xMin: 0,
	}

	const pageView = addPoints(
		data.positions,
		createEmptyView({ width: boundary.xMax, height: boundary.yMax }, " ")
	)

	let fold1 = copyView(pageView)
	for (let i = 0; i < data.actions.length; i++) {
		fold1 = fold(fold1, data.actions[i])
	}

	console.log(fold1.value)
	return [
		[pageView, pageView],
		[pageView, pageView],
	]
}
