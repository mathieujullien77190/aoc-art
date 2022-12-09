/** @format */

import { useState } from "react"
import styled from "styled-components"

import Game2021 from "./game/loading/2021"
import GameDay1 from "./game/loading/day1"
import GameDay4 from "./game/loading/day4"
import GameDay5 from "./game/loading/day5"
import GameDay9 from "./game/loading/day9"

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
		day: "0",
		fn: () => {
			return "2021 | Day 25: Sea Cucumber"
		},
	},

	{
		day: "1",
		fn: () => {
			return "2022 | Day 1: Calorie Counting"
		},
	},
	{
		day: "4",
		fn: () => {
			return "2022 | Day 4: Camp Cleanup"
		},
	},
	{
		day: "5",
		fn: () => {
			return "2022 | Day 5: Supply Stacks"
		},
	},
	{
		day: "9",
		fn: () => {
			return "2022 | Day 9: Rope Bridge"
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
					{day === "0" && <Game2021 />}
					{day === "1" && <GameDay1 />}
					{day === "4" && <GameDay4 />}
					{day === "5" && <GameDay5 />}
					{day === "9" && <GameDay9 />}
				</Container>
			)}
		</>
	)
}
