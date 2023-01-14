/** @format */

export const modulo = (value, max) => {
	if (value < 0) return (max - (Math.abs(value) % max)) % max
	return value % max
}

export const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a))

export const rand = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min)
