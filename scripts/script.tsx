/** @format */

import { useState } from "react"
import styled from "styled-components"

import Game2021 from "./game/loading/2021"
import GameDay1 from "./game/loading/day1"
import GameDay4 from "./game/loading/day4"
import GameDay5 from "./game/loading/day5"
import GameOctopus from "./game/loading/octopus"
import { colors } from "_components/constants"

const Container = styled.div`
	position: fixed;
	padding: 24px;
	top: 24px;
	right: 24px;
	bottom: 24px;
	left: 24px;
	z-index: 10;
	background: ${colors.overlay};
	border: solid 2px ${colors.textColor};
	cursor: pointer;
	overflow: auto;
`

export const scripts = [
	{
		day: "-1",
		fn: () => {
			return "Test d'une animation du AOC 2021"
		},
	},
	{
		day: "-2",
		fn: () => {
			return "Test d'une animation du AOC 2021 : octopus"
		},
	},
	{
		day: "1",
		fn: () => {
			return "--- Day 1: Calorie Counting ---"
		},
	},
	{
		day: "4",
		fn: () => {
			return "--- Day 4: Camp Cleanup ---"
		},
	},
	{
		day: "5",
		fn: () => {
			return "--- Day 5: Supply Stacks ---"
		},
	},
]

export const Games = ({ day }: { day: string }) => {
	const [display, setDisplay] = useState<boolean>(true)

	const search = scripts.filter(script => script.day === day)

	return (
		<>
			{display && search.length === 1 && (
				<Container onClick={() => setDisplay(false)}>
					{day === "-1" && <Game2021 />}
					{day === "-2" && <GameOctopus />}
					{day === "1" && <GameDay1 />}
					{day === "4" && <GameDay4 />}
					{day === "5" && <GameDay5 />}
				</Container>
			)}
		</>
	)
}
