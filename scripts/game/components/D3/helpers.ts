/** @format */

import { Transform } from "./types"

export const next = (
	value: number,
	options: {
		min: number
		max: number
		loop?: boolean
		withTransition?: boolean
	},
	nextValue: number
): Transform<number> => {
	if (nextValue > 0) {
		return {
			withTransition: !!options.withTransition,
			value:
				Math.floor(
					(value + nextValue > options.max
						? options.loop
							? options.min
							: options.max
						: value + nextValue) * 10
				) / 10,
			diff: nextValue,
		}
	}

	return {
		withTransition: !!options.withTransition,
		value:
			Math.floor(
				(value + nextValue < options.min
					? options.loop
						? options.max
						: options.min
					: value + nextValue) * 10
			) / 10,
		diff: nextValue,
	}
}
