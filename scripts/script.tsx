/** @format */

import { useState } from "react"
import styled from "styled-components"

import Game2021 from "./game/loading/2021"
import GameDay1 from "./game/loading/day1"
import GameDay4 from "./game/loading/day4"
import GameDay5 from "./game/loading/day5"
import GameDay9 from "./game/loading/day9"
import GameDay12 from "./game/loading/day12"
import GameDay14 from "./game/loading/day14"
import GameDay18 from "./game/loading/day18"

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

const Title = styled.p`
	position: fixed;
	padding: 8px;
	top: -10px;
	left: 40px;
	right: 40px;
	z-index: 11;

	background: ${colors.overlay};
	border: solid 2px ${colors.textColor};

	a {
		color: white;
	}
`

export const scripts = [
	{
		day: "25",
		year: "2022",
		fn: () => {
			return "2021 | Day 25: Sea Cucumber"
		},
	},

	{
		day: "1",
		year: "2022",
		fn: () => {
			return "2022 | Day 1: Calorie Counting"
		},
	},
	{
		day: "4",
		year: "2022",
		fn: () => {
			return "2022 | Day 4: Camp Cleanup"
		},
	},
	{
		day: "5",
		year: "2022",
		fn: () => {
			return "2022 | Day 5: Supply Stacks"
		},
	},
	{
		day: "9",
		year: "2022",
		fn: () => {
			return "2022 | Day 9: Rope Bridge"
		},
	},
	{
		day: "12",
		year: "2022",
		fn: () => {
			return "2022 | Day 12: Hill Climbing Algorithm"
		},
	},
	{
		day: "14",
		year: "2022",
		fn: () => {
			return "2022 | Day 14: Regolith Reservoir"
		},
	},
	{
		day: "18",
		year: "2022",
		fn: () => {
			return "2022 | Day 18: Boiling Boulders"
		},
	},
]

export const Games = ({ day }: { day: string }) => {
	const [display, setDisplay] = useState<boolean>(true)

	const search = scripts.filter(script => script.day === day)
	const link =
		search.length === 1
			? `https://adventofcode.com/${search[0].year}/day/${search[0].day}`
			: ""

	return (
		<>
			{display && search.length === 1 && (
				<Container onClick={() => setDisplay(false)}>
					<Title
						onClick={e => {
							e.stopPropagation()
						}}
					>
						{search[0].fn()} [{" "}
						<a href={link} target="_blank">
							voir l'exercice
						</a>{" "}
						]
					</Title>
					{day === "25" && <Game2021 />}
					{day === "1" && <GameDay1 />}
					{day === "4" && <GameDay4 />}
					{day === "5" && <GameDay5 />}
					{day === "9" && <GameDay9 />}
					{day === "12" && <GameDay12 />}
					{day === "14" && <GameDay14 />}
					{day === "18" && <GameDay18 />}
				</Container>
			)}
		</>
	)
}
