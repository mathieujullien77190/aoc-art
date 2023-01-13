/** @format */

import Game2021 from "./loading/2021"
import GameDay1 from "./loading/day1"
import GameDay4 from "./loading/day4"
import GameDay5 from "./loading/day5"
import GameDay9 from "./loading/day9"
import GameDay12 from "./loading/day12"
import GameDay14 from "./loading/day14"
import GameDay18 from "./loading/day18"
import GameDay22 from "./loading/day22"

export type GameConfig = {
	day: string
	year: string
	title: string
	component: () => JSX.Element
}

export const gamesConfig: GameConfig[] = [
	{
		day: "25",
		year: "2022",
		title: "Sea Cucumber",
		component: () => <Game2021 />,
	},
	{
		day: "1",
		year: "2022",
		title: "Calorie Counting",
		component: () => <GameDay1 />,
	},
	{
		day: "4",
		year: "2022",
		title: "Camp Cleanup",
		component: () => <GameDay4 />,
	},
	{
		day: "5",
		year: "2022",
		title: "Supply Stacks",
		component: () => <GameDay5 />,
	},
	{
		day: "9",
		year: "2022",
		title: "Rope Bridge",
		component: () => <GameDay9 />,
	},
	{
		day: "12",
		year: "2022",
		title: "Hill Climbing Algorithm",
		component: () => <GameDay12 />,
	},
	{
		day: "14",
		year: "2022",
		title: "Regolith Reservoir",
		component: () => <GameDay14 />,
	},
	{
		day: "18",
		year: "2022",
		title: "Boiling Boulders",
		component: () => <GameDay18 />,
	},
	{
		day: "22",
		year: "2022",
		title: "Monkey Map",
		component: () => <GameDay22 />,
	},
]