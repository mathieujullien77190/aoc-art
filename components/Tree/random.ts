/** Small seeded generator: the same seed always draws the same numbers. */
export const mulberry32 = (seed: number) => {
	let a = seed | 0
	return () => {
		a = (a + 0x6d2b79f5) | 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export const clamp = (v: number, min: number, max: number) =>
	Math.min(max, Math.max(min, v))
