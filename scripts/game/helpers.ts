/** @format */

export const extractTab1 = (d, separator) => {
	return d.split(separator)
}

export const extractTab2 = (d, firstSeparator, secondSeparator) => {
	return d.split(firstSeparator).map(item => item.split(secondSeparator))
}

export const extractTab3 = (
	d,
	firstSeparator,
	secondSeparator,
	thirdSepartor
) => {
	return d.split(firstSeparator).map(item =>
		item
			.split(secondSeparator)
			.filter(item => item != "")
			.map(item2 => item2.split(thirdSepartor).filter(item => item != ""))
	)
}

export const extractTab3Int = (
	d,
	firstSeparator,
	secondSeparator,
	thirdSepartor
) => {
	return d
		.split(firstSeparator)
		.map(item =>
			item
				.split(secondSeparator)
				.filter(item => item != "")
				.map(item2 =>
					item2
						.split(thirdSepartor)
						.filter(item => item != "")
						.map(item => +item)
				)
		)
		.filter(item => item.length > 0)
}

export const count = arr => arr.reduce((acc, curr) => acc + curr, 0)

export const sort = arr => [...arr].sort((a, b) => a - b)

export const createArray = size => [...Array(size)].map(_ => 0)

export const sortString = str =>
	str
		.split("")
		.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
		.join("")

export const copy = objectOrArray => JSON.parse(JSON.stringify(objectOrArray))

export const read = (
	arr: string[],
	timeStep: number,
	fn: ({ view, i }: { view: string; i: number }) => void,
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

export const getNeighbours = (arr, lineI, columnI, matrix) => {
	return matrix
		.map(item => {
			if (
				arr[lineI + item[0]] &&
				arr[lineI + item[0]][columnI + item[1]] !== undefined
			) {
				return {
					value: arr[lineI + item[0]][columnI + item[1]],
					lineI: lineI + item[0],
					columnI: columnI + item[1],
				}
			}
			return null
		})
		.filter(item => item !== null)
}

export const arr2DForEach = (arr, fn) => {
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			fn.call(this, { item: arr[i][j], indexLine: i, indexColumn: j })
		}
	}
}

export const rotate90 = arr => {
	let arr2 = createArray(Math.max(...arr.map(item => item.length))).map(
		() => []
	)
	arr2DForEach(arr, ({ item, indexLine, indexColumn }) => {
		arr2[indexColumn][indexLine] = item
	})
	return arr2
}

export const mergeView = (back, front, x, y) => {
	let arr = back.map(item => item.slice(0))
	for (let i = 0; i < front.length; i++) {
		for (let j = 0; j < front[i].length; j++) {
			arr[i + y][j + x] = front[i][j]
		}
	}
	return arr
}
