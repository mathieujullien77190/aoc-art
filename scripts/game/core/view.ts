/** @format */

type View = { width: number; height: number; value: string }

type Position = { x: number; y: number }

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

export const mergeView = (back: View, front: View, position: Position) => {
	let copy = { ...back }
	let line, first, last
	const frontWidth = front.width + 1
	const backWidth = back.width + 1
	const partx = Math.abs(position.x + front.width - back.width)
	const party = Math.abs(position.y + front.height - back.height)
	for (let i = 0; i < party; i++) {
		line = front.value.substring(i * frontWidth, i * frontWidth + partx)
		first = copy.value.substring(0, (position.y + i) * backWidth + position.x)
		last = copy.value.substring(
			(position.y + i) * backWidth + position.x + line.length
		)

		copy.value = first + line + last
	}

	return copy
}
