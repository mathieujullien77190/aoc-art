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
import GameDay13 from "./loading/day13"
import GameDay15 from "./loading/day15"
import GamePlayground from "./loading/playground"
import Retro from "./loading/Retro"

export type GameConfig = {
	day: string
	year: string
	title: string
	special?: boolean
	component: () => JSX.Element
}

export const gamesConfig: GameConfig[] = [
	{
		day: "25",
		year: "2021",
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
		day: "15",
		year: "2021",
		title: "Chiton",
		component: () => <GameDay15 />,
	},
	// {
	// 	day: "13",
	// 	year: "2021",
	// 	title: "Transparent Origami",
	// 	component: () => <GameDay13 />,
	// },
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
	{
		day: "playground",
		year: "XXXX",
		title: "Playground",
		special: true,
		component: () => <GamePlayground />,
	},
	{
		day: "retro",
		year: "XXXX",
		title: "Retro starlord",
		special: true,
		component: () => <Retro />,
	},
]
