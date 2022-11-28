/** @format */

import Game2021 from "./game/2021"

export const scripts = [
	{
		day: "-1",
		fn: () => {
			return "Test d'une animation du AOC 2021"
		},
	},
]

export const Games = ({ day }: { day: string }) => {
	return <>{day === "-1" && <Game2021 />}</>
}
