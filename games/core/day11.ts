/** @format */
import { input } from "_games/data/day11"

import { ViewPlan, Position3D, View } from "_games/helpers/types"
import { createArray } from "_games/helpers/utils"
import { createView, getChar, setChar } from "_games/helpers/view"
import {
	createEmptyViewPlanFromString,
	iterator,
	getCharPlan,
	setCharPlan,
	searchCharsPlan,
	getNeighbours,
	replaceCharPlan,
} from "_games/helpers/viewPlan"
import { rand } from "_games/helpers/math"

const all0 = (plans: ViewPlan): boolean => {
	let count = 0
	iterator(plans, (pos, value) => {
		if (value !== "0" && value !== " ") count++
	})
	return count === 0
}

const removeOctopus = (view: View, nb: number) => {
	let i = nb
	while (i > 0) {
		const x = rand(0, view.size.width)
		const y = rand(0, view.size.height)
		const char = getChar(view, { x, y })
		if (char !== " " && char !== "\n") {
			view = setChar(view, { x, y }, " ")
			i--
		}
	}
	return view
}

const baseView = createView(input)
export const data = createEmptyViewPlanFromString(
	createArray(5).map(() => removeOctopus(baseView, 0).value),
	{}
)

const inscrease = (
	plans: ViewPlan,
	pos: Position3D,
	type: string
): ViewPlan => {
	const energy = getCharPlan(plans, pos)

	if (!isNaN(+energy) && energy !== " ")
		return setCharPlan(
			plans,
			pos,
			+energy + 1 > 9 ? type : (+energy + 1).toString()
		)
	return plans
}

const getFlashesNeightbours = (
	plans: ViewPlan
): { pos: Position3D; value: string }[] => {
	let neightbours = []
	const flashes = searchCharsPlan(plans, "#")
	for (let i = 0; i < flashes.length; i++) {
		neightbours = [...neightbours, ...getNeighbours(plans, flashes[i], true)]
	}
	return neightbours
}

const step1 = (map: ViewPlan): ViewPlan => {
	iterator(map, pos => {
		map = inscrease(map, pos, "#")
	})

	return map
}

const step2 = (plans: ViewPlan): ViewPlan => {
	let neightbours: { pos: Position3D; value: string }[] = []

	do {
		neightbours = getFlashesNeightbours(plans)
		plans = replaceCharPlan(plans, "#", "@")
		neightbours.forEach(({ pos }) => {
			plans = inscrease(plans, pos, "#")
		})
	} while (neightbours.length > 0)

	return plans
}

const step3 = (plans: ViewPlan): ViewPlan => {
	return replaceCharPlan(plans, "@", "0")
}

export const init = (map: ViewPlan): ViewPlan[] => {
	let times = [map]
	let i = 0
	do {
		map = step1(map)
		map = step2(map)
		map = step3(map)
		times.push(map)
		i++
	} while (!all0(map) && i < 2000)

	console.log(times, i)

	return times
}
