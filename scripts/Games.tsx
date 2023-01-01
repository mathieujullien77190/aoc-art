/** @format */

import { useState } from "react"
import styled from "styled-components"

import { colors } from "_components/constants"

import { sendRestrictedCommand } from "_commands/helpers"
import { useAppDispatch } from "_store/hooks"

import { gamesConfig } from "./constants"

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
	overflow: auto;
`

const Title = styled.div`
	position: fixed;
	padding: 8px;
	top: 6px;
	left: 40px;
	right: 40px;
	z-index: 11;
	display: flex;

	background: ${colors.overlay};
	border: solid 2px ${colors.textColor};

	a {
		color: white;
	}

	div {
		display: inline-block;
		margin: 0 5px;

		&.close {
			margin-left: auto;

			> span {
				color: white;
				text-decoration: underline;
				cursor: pointer;
			}
		}
	}
`

export const Games = ({ day }: { day: string }) => {
	const dispatch = useAppDispatch()
	const [display, setDisplay] = useState<boolean>(true)

	const search = gamesConfig.filter(script => script.day === day)
	const link =
		search.length === 1
			? `https://adventofcode.com/${search[0].year}/day/${search[0].day}`
			: ""

	return (
		<>
			{display && search.length === 1 && (
				<Container>
					<>
						<Title>
							<div>{search[0].title}</div>
							<div>
								[{" "}
								<a href={link} target="_blank">
									voir l'exercice
								</a>{" "}
								]
							</div>
							<div className="close">
								[{" "}
								<span
									onClick={() => {
										setDisplay(false)
										sendRestrictedCommand("closeday", dispatch)
									}}
								>
									Fermer
								</span>{" "}
								]
							</div>
						</Title>

						{search[0].component}
					</>
				</Container>
			)}
		</>
	)
}
