/** @format */

export const modulo = (value, max) => {
	if (value < 0) return (max - (Math.abs(value) % max)) % max
	return value % max
}
