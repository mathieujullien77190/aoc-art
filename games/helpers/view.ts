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

	return { value, width, height }
}

export const copyView = (view: View): View => ({
	value: view.value,
	width: view.width,
	height: view.height,
})

export const createEmptyView = (size: Size, str: string = " "): View => {
	str.repeat(size.width)
	return {
		value: createArray(size.height)
			.map(() => str.repeat(size.width))
			.join("\n"),
		width: size.width,
		height: size.height,
	}
}

export const createView = (
	data: string | string[][],
	complete: boolean
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
	const secondSizeX = Math.min(size, view.width - pos.x - 1)
	const firstSizeY = Math.min(size, pos.y)
	const secondSizeY = Math.min(size, view.height - pos.y - 1)

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
		const X = (i + yStart) * (view.width + 1) + xStart
		const Y = X + (firstSizeX + secondSizeX + 1)
		line = emptyColFirst + view.value.substring(X, Y) + emptyColSecond
		clipView += line
		if (i < calcSize) clipView += "\n"
	}

	const value = emptyLineFirst + clipView + emptyLineSecond

	return {
		value,
		width: line.length,
		height: value.match(/\n/g).length + 1,
	}
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
	let copy = { ...back }
	let line, first, last
	const frontWidth = front.width + 1
	const backWidth = back.width + 1
	const partX =
		position.x + front.width > back.width
			? front.width - (position.x + front.width - back.width)
			: front.width
	const partY =
		position.y + front.height > back.height
			? front.height - (position.y + front.height - back.height)
			: front.height

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
	fn: ({ view, i }: { view: T; i: number }) => void,
	end?: () => void
): number => {
	const timer = window.setInterval(
		initTime => {
			const index = Math.floor((new Date().getTime() - initTime) / timeStep) - 1
			if (arr[index]) fn.call(this, { view: arr[index], i: index }, timer)
			else {
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
	const y = Math.floor(realValue / (view.width + 1))
	const x = realValue - y * (view.width + 1)

	return { x, y }
}

export const getChar = (view: View, pos: Position): string => {
	return view.value[pos.y * (view.width + 1) + pos.x]
}

export const setChar = (view: View, pos: Position, str: string): View => {
	const index = pos.y * (view.width + 1) + pos.x
	return {
		value: view.value.slice(0, index) + str + view.value.slice(index + 1),
		height: view.height,
		width: view.width,
	}
}

export const replaceChar = (view: View, str: string, replace: string): View => {
	return {
		value: view.value.replace(str, replace),
		height: view.height,
		width: view.width,
	}
}

export const getNeighbours = (
	view: View,
	pos: Position
): { value: string; pos: Position }[] => {
	let matrix = [
		{
			cond: pos.y - 1 >= 0,
			pos: (pos.y - 1) * (view.width + 1) + pos.x,
			realPos: { x: pos.x, y: pos.y - 1 },
		},
		{
			cond: pos.y + 1 < view.height,
			pos: (pos.y + 1) * (view.width + 1) + pos.x,
			realPos: { x: pos.x, y: pos.y + 1 },
		},
		{
			cond: pos.x - 1 >= 0,
			pos: pos.y * (view.width + 1) + pos.x - 1,
			realPos: { x: pos.x - 1, y: pos.y },
		},
		{
			cond: pos.x + 1 < view.width,
			pos: pos.y * (view.width + 1) + pos.x + 1,
			realPos: { x: pos.x + 1, y: pos.y },
		},
	]

	return matrix
		.filter(item => item.cond)
		.map(item => ({ value: view.value[item.pos], pos: item.realPos }))
}

export const iterator = (
	view: View,
	cb: (pos: Position) => void,
	conditions: { x: (x: number) => boolean; y: (y: number) => boolean } = {
		x: () => true,
		y: () => true,
	}
): void => {
	for (let y = 0; conditions.y(y) && y < view.height; y++) {
		for (let x = 0; conditions.x(x) && x < view.width; x++) {
			cb({ x, y })
		}
	}
}
