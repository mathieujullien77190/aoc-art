/** @format */
import { useState, useRef, useEffect } from "react"
import styled from "styled-components"
import { colors } from "_components/constants"

import { generateGame, init } from "../core/day12"

const Game = styled.div`
	margin: 0;
	font-size: 0;
	min-width: 1135px;
	padding: 10px;

	div {
		display: inline-block;
		width: 8px;
		height: 8px;
		margin: 1px;
	}

	#nb {
		font-weight: bold;
		position: absolute;
		z-index: 10;
		background: white;
		padding: 5px;
		border: solid 1px black;
	}
`

const Help = styled.ul`
	max-width: 1135px;
`

const Container = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`

const Case = ({ color }: { color?: string }) => (
	<div
		style={{
			border: "solid 1px white",
			display: "inline-block",
			background: color,

			width: "10px",
			height: "10px",
		}}
	></div>
)

const Animation = () => {
	const [HTML, setHTML] = useState<string>(generateGame())
	const refGame = useRef<HTMLDivElement>(null)
	const [nb, setNb] = useState<number>(0)

	useEffect(() => {
		if (refGame.current) {
			init(0, 20, refGame.current, listPass => {
				setNb(listPass.length - 1)
			})
		}
	}, [])

	return (
		<Container
			onClick={e => {
				e.stopPropagation()
			}}
		>
			<h1 style={{ fontSize: "60px" }}>PAS FINIIIIIIII!!!!!!!</h1>
			<Help>
				<li>
					Vous êtes le point rouge <Case color="red" />
				</li>

				<li>
					Vous devez rejoindre la case verte <Case color={colors.appColor} /> en
					380 coups maximum
				</li>

				<li>
					Les case blanches <Case color="white" /> sont au même niveau que vous,
					les oranges{" "}
					<div
						style={{
							display: "inline-block",
							background: colors.importantColor,
							width: "10px",
							height: "10px",
						}}
					></div>{" "}
					sont à un niveau inférieur, les bleues claire{" "}
					<Case color={colors.infoColor} /> juste au dessus de vous et les
					bleues foncées <Case /> sont inaccessibles
				</li>

				<li>Appuyez sur les flèches de direction ← ↓ ↑ → pour vous déplacer</li>
			</Help>
			<Game dangerouslySetInnerHTML={{ __html: HTML }} ref={refGame} />
			<p>Coups : {nb}</p>
		</Container>
	)
}

export default Animation
