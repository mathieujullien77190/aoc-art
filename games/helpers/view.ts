/** @format */

import { createArray } from "./utils"
import { View, Position, Size } from "./types"

const createViewFromString = (arr: string[], complete: boolean): View => {
	let value, width, height
	if (complete) {
		const max = Math.max(...arr.map(item => item.length))
		const add = " ".repeat(max)
		const arrNormal = arr.map(item => `${item}${add}`.substring(0, max))
		value = arrNormal.join("\n")
		width = max
		height = arr.length
	} else {
		width = arr[0].length
		value = arr.join("\n")
		height = arr.length
	}

	return { value, size: { width, height } }
}

export const copyView = (view: View): View => ({
	value: view.value,
	size: view.size,
})

export const createEmptyView = (size: Size, str: string = " "): View => {
	str.repeat(size.width)
	return {
		value: createArray(size.height)
			.map(() => str.repeat(size.width))
			.join("\n"),
		size,
	}
}

export const createView = (
	data: string | string[][],
	complete: boolean = false
): View => {
	if (typeof data === "string") {
		return createViewFromString(data.split("\n"), complete)
	} else {
		return createViewFromString(
			data.map(item => item.join("")),
			complete
		)
	}
}

export const areEqual = (view1: View, view2: View) => {
	return view1.value === view2.value
}

export const clipView = (
	view: View,
	pos: Position,
	size: number,
	debug: string = " "
): View => {
	const realSize = size * 2 + 1

	let clipView = ""
	let emptyLineFirst = ""
	let emptyLineSecond = ""
	let emptyColFirst = ""
	let emptyColSecond = ""

	const xStart = pos.x - size < 0 ? 0 : pos.x - size
	const yStart = pos.y - size < 0 ? 0 : pos.y - size

	const firstSizeX = Math.min(size, pos.x)
	const secondSizeX = Math.min(size, view.size.width - pos.x - 1)
	const firstSizeY = Math.min(size, pos.y)
	const secondSizeY = Math.min(size, view.size.height - pos.y - 1)

	if (firstSizeY < size) {
		for (let i = 0; i < size - firstSizeY; i++) {
			emptyLineFirst += debug.repeat(realSize) + "\n"
		}
	}
	if (secondSizeY < size) {
		for (let i = 0; i < size - secondSizeY; i++) {
			emptyLineSecond += "\n" + debug.repeat(realSize)
		}
	}
	if (firstSizeX < size) emptyColFirst = debug.repeat(size - firstSizeX)
	if (secondSizeX < size) emptyColSecond = debug.repeat(size - secondSizeX)

	const calcSize = firstSizeY + secondSizeY

	let line = ""

	for (let i = 0; i < calcSize + 1; i++) {
		const X = (i + yStart) * (view.size.width + 1) + xStart
		const Y = X + (firstSizeX + secondSizeX + 1)
		line = emptyColFirst + view.value.substring(X, Y) + emptyColSecond
		clipView += line
		if (i < calcSize) clipView += "\n"
	}

	const value = emptyLineFirst + clipView + emptyLineSecond

	return {
		value,
		size: { width: line.length, height: value.match(/\n/g).length + 1 },
	}
}

export const extract = (
	view: View,
	pos: Position,
	size: Size,
	debug: boolean = false
) => {
	if (debug) {
		if (pos.y >= view.size.height || pos.y < 0)
			console.log("ERROR : invalid y position")
		if (pos.x >= view.size.width || pos.x < 0)
			console.log("ERROR : invalid x position")
	}

	const trueSize = {
		width:
			pos.x + size.width > view.size.width
				? view.size.width - pos.x
				: size.width,
		height:
			pos.y + size.height > view.size.height
				? view.size.height - pos.y
				: size.height,
	}

	let str = ""

	for (let i = 0; i < trueSize.height; i++) {
		const start = (view.size.width + 1) * (pos.y + i) + pos.x
		str +=
			view.value.slice(start, start + trueSize.width) +
			(i < trueSize.height - 1 ? "\n" : "")
	}

	return { value: str, size: trueSize }
}

export const mergeViews = (
	back: View,
	front: { view: View; position: Position }[]
) => {
	front.forEach(({ view, position }) => {
		back = mergeView(back, view, position)
	})

	return back
}

export const mergeView = (back: View, front: View, position: Position) => {
	let copy = copyView(back)
	let line, first, last
	const frontWidth = front.size.width + 1
	const backWidth = back.size.width + 1
	const partX =
		position.x + front.size.width > back.size.width
			? front.size.width - (position.x + front.size.width - back.size.width)
			: front.size.width
	const partY =
		position.y + front.size.height > back.size.height
			? front.size.height - (position.y + front.size.height - back.size.height)
			: front.size.height

	for (let i = 0; i < partY; i++) {
		line = front.value.substring(i * frontWidth, i * frontWidth + partX)
		first = copy.value.substring(0, (position.y + i) * backWidth + position.x)
		last = copy.value.substring(
			(position.y + i) * backWidth + position.x + line.length
		)

		copy.value = first + line + last
	}

	return copy
}

export const read = <T>(
	arr: T[],
	timeStep: number,
	indexStart: number,
	fn: ({ view, i }: { view: T; i: number }) => void,
	end?: () => void
): number => {
	const timer = window.setInterval(
		initTime => {
			const index =
				Math.floor((new Date().getTime() - initTime) / timeStep) -
				1 +
				indexStart
			if (arr[index]) {
				fn.call(this, { view: arr[index], i: index }, timer)
			} else {
				fn.call(this, { view: arr[arr.length - 1], i: arr.length - 1 }, timer)
				clearInterval(timer)
				if (end) end()
			}
		},
		timeStep,
		new Date().getTime()
	)
	return timer
}

export const searchChar = (view: View, str: string): Position => {
	const realValue = view.value.indexOf(str)
	const y = Math.floor(realValue / (view.size.width + 1))
	const x = realValue - y * (view.size.width + 1)

	return { x, y }
}

export const getChar = (view: View, pos: Position): string => {
	return view.value[pos.y * (view.size.width + 1) + pos.x]
}

export const setChar = (view: View, pos: Position, str: string): View => {
	const index = pos.y * (view.size.width + 1) + pos.x
	return {
		value:
			view.value.slice(0, index) + str + view.value.slice(index + str.length),
		size: view.size,
	}
}

export const replaceChar = (view: View, str: string, replace: string): View => {
	return {
		value: view.value.replace(new RegExp(str, "g"), replace),
		size: view.size,
	}
}

export const getNeighbours = (
	view: View,
	pos: Position,
	diff: number = 1
): { value: string; pos: Position; type: string }[] => {
	let matrix = [
		{
			cond: pos.y - diff >= 0,
			pos: (pos.y - diff) * (view.size.width + diff) + pos.x,
			realPos: { x: pos.x, y: pos.y - diff },
			type: "T",
		},
		{
			cond: pos.y + diff < view.size.height,
			pos: (pos.y + diff) * (view.size.width + diff) + pos.x,
			realPos: { x: pos.x, y: pos.y + diff },
			type: "B",
		},
		{
			cond: pos.x - diff >= 0,
			pos: pos.y * (view.size.width + diff) + pos.x - diff,
			realPos: { x: pos.x - diff, y: pos.y },
			type: "L",
		},
		{
			cond: pos.x + diff < view.size.width,
			pos: pos.y * (view.size.width + diff) + pos.x + diff,
			realPos: { x: pos.x + diff, y: pos.y },
			type: "R",
		},
	]

	return matrix
		.filter(item => item.cond)
		.map(item => ({
			value: view.value[item.pos],
			pos: item.realPos,
			type: item.type,
		}))
		.filter(item => !!item.value)
}

export const iterator = (
	view: View,
	cb: (pos: Position, str: string) => void,
	conditions: {
		x: (pos: Position) => boolean
		y: (pos: Position) => boolean
	} = {
		x: () => true,
		y: () => true,
	}
): void => {
	let y = 0
	let x = 0

	for (y = 0; conditions.y({ x, y }) && y < view.size.height; y++) {
		for (x = 0; conditions.x({ x, y }) && x < view.size.width; x++) {
			cb({ x, y }, getChar(view, { x, y }))
		}
	}
}
