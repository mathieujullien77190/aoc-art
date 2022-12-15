/** @format */

import { createArray } from "./helpers"

export type View = { width?: number; height?: number; value: string }

export type Position = { x: number; y: number }

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

	for (let i = 0; i < calcSize + 1; i++) {
		const X = (i + yStart) * (view.width + 1) + xStart
		const Y = X + (firstSizeX + secondSizeX + 1)
		clipView += emptyColFirst + view.value.substring(X, Y) + emptyColSecond
		if (i < calcSize) clipView += "\n"
	}

	return {
		value: emptyLineFirst + clipView + emptyLineSecond,
		width: size,
		height: size,
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

export const read = (
	arr: View[],
	timeStep: number,
	fn: ({ view, i }: { view: View; i: number }) => void,
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
