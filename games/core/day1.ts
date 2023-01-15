/** @format */

import { input } from "_games/data/day1"

const baseBoat = `        
        
/'.__.'\\
\\      \/`
const man1 = `O__, 
|\\/__
 /   `
const man2 = `O__, 
|\\/__
     `

const emptyArray = nb => [...Array(nb)]

const spacesString = nb =>
	emptyArray(nb)
		.map(() => " ")
		.join("")

const extractData = d =>
	d
		.split("\n\n")
		.map(item => item.split("\n"))
		.map(group => group.map(item => +item))
		.map(item => item.reduce((acc, curr) => acc + curr), 0)

const formatValue = value =>
	value >= 10000 ? `${Math.floor(value / 1000)} K ` : `${value} `

const createFullBoat = (man1, man2, data) => {
	const leftRightMan = [man1.split("\n"), man2.split("\n")]
	return data.map((item, i) => [formatValue(item), ...leftRightMan[i % 2]])
}

const createBeautifullBoat = (baseBoat, fullBoat) => {
	const justElves = fullBoat.reduce(
		(acc, curr) => curr.map((item, i) => `${acc[i]}${item}`),
		["", "", "", ""]
	)
	return baseBoat
		.map((item, i) => item.substring(0, 4) + justElves[i] + item.substring(4))
		.join("\n")
}

const clip = (allScreen, size) => {
	const lines = allScreen
		.split("\n")
		.map(item => `${spacesString(size)}${item}${spacesString(size)}`)
	const sizeLine = lines[0].length + 1

	return emptyArray(sizeLine).map((_, i) =>
		lines
			.map((item, j) => {
				return item.substr(0 - size - i, size)
			})
			.join("\n")
	)
}

const addWater = (clip, size) =>
	clip.map(
		view =>
			`${view}\n${emptyArray(size)
				.map((_, i) => ["~", "^"][i % 2])
				.join("")}`
	)

export const extractMax = (extract, max) => {
	if (/^\ [0-9]+\ K\ $/gi.exec(extract)) {
		if (parseInt(extract) * 1000 > max) return parseInt(extract, 10) * 1000
	}
	if (/^\ [0-9]+\ $/gi.exec(extract)) {
		if (parseInt(extract) > max) return parseInt(extract, 10)
	}

	return max
}

export const generateViews = (sizeClip, dataSize) => {
	const data = extractData(input).filter(
		(_, i, tab) => i < Math.floor((tab.length * dataSize) / 100)
	)
	const fullBoat = createFullBoat(man1, man2, data)
	const beautifullBoat = createBeautifullBoat(baseBoat.split("\n"), fullBoat)
	const views = clip(beautifullBoat, sizeClip)
	const viewsWater = addWater(views, sizeClip)

	return viewsWater
}
