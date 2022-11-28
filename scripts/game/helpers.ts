/** @format */

export const extractTab1 = (d, separator) => {
	return d.split(separator).filter(item => item != "")
}

export const extractTab2 = (d, firstSeparator, secondSeparator) => {
	return d
		.split(firstSeparator)
		.map(item => item.split(secondSeparator))
		.filter(item => item != "")
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
	fn: (arg: string) => void
): number => {
	const timer = window.setInterval(
		initTime => {
			const index = Math.floor((new Date().getTime() - initTime) / timeStep) - 1
			if (arr[index]) fn.call(this, arr[index], timer)
			else clearInterval(timer)
		},
		timeStep,
		new Date().getTime()
	)
	return timer
}
