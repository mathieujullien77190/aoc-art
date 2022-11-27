/** @format */

export const rand = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min)

export const sameLetters = (nb: number, letter: string = " "): string =>
	Array(nb)
		.fill(null)
		.map(() => letter)
		.join("")

export const strSpaces = (str: string, nbMax: number) => {
	return `${str} ${sameLetters(nbMax - str.length)}`
}

export const strTime = (timestamp: number, indexDay: number, year: number) => {
	const allStart = Array(24)
		.fill(null)
		.map((_, i) => new Date(`Wed Dec ${i + 1} ${year} 06:00:00 GMT+0100`))
	const start = new Date(timestamp * 1000)
	const diff = start.getTime() - allStart[indexDay].getTime()
	const hours = Math.floor(diff / (3600 * 1000))
	const minutes = Math.floor((diff - hours * 3600 * 1000) / (60 * 1000))
	const seconds = Math.floor(
		(diff - hours * 3600 * 1000 - minutes * 60 * 1000) / 1000
	)
	return `${("0" + hours).substring(0, 2)}h${("0" + minutes).substring(
		0,
		2
	)}m${("0" + seconds).substring(0, 2)}s`
}
