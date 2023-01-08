/** @format */

export const next = (
	value: number,
	options: {
		min: number
		max: number
	},
	nextValue: number
): { value: number; diff: number } => {
	if (nextValue > 0) {
		return {
			value:
				Math.floor(
					(value + nextValue > options.max ? options.min : value + nextValue) *
						10
				) / 10,
			diff: nextValue,
		}
	}

	return {
		value:
			Math.floor(
				(value + nextValue < options.min ? options.max : value + nextValue) * 10
			) / 10,
		diff: nextValue,
	}
}
