/**
 * What describes a game, minus its component. constants.tsx imports
 * styled-components components, unusable server side: static pages need
 * the list without them.
 *
 * Order matters: `aoc 1` designates the index in this array.
 */
export type GameMeta = {
	day: string
	year: string
	title: string
	special?: boolean
	tag?: "New" | "Best"
}

export const gamesMeta: GameMeta[] = [
	{ day: "25", year: "2021", title: "Sea Cucumber" },
	{ day: "1", year: "2022", title: "Calorie Counting" },
	{ day: "4", year: "2022", title: "Camp Cleanup" },
	{ day: "5", year: "2022", title: "Supply Stacks" },
	{ day: "9", year: "2022", title: "Rope Bridge" },
	{ day: "12", year: "2022", title: "Hill Climbing Algorithm", tag: "Best" },
	{ day: "15", year: "2021", title: "Chiton" },
	{ day: "14", year: "2022", title: "Regolith Reservoir" },
	{ day: "18", year: "2022", title: "Boiling Boulders" },
	{ day: "22", year: "2022", title: "Monkey Map" },
	{ day: "8", year: "2023", title: "Haunted Wasteland" },
	{ day: "10", year: "2023", title: "Pipe Maze" },
	{ day: "14", year: "2023", title: "Parabolic Reflector Dish" },
	{ day: "21", year: "2023", title: "Step Counter", tag: "New" },
	{ day: "XX", year: "XXXX", title: "Playground", special: true },
]

/** the key of a game: year and day never repeat */
export const gameKey = ({ year, day }: Pick<GameMeta, "year" | "day">) =>
	`${year}-${day}`
