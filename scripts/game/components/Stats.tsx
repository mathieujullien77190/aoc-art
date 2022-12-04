/** @format */
import { useState } from "react"
import styled from "styled-components"

import { colors } from "_components/constants"

const Container = styled.pre``

const Wrapper = styled.div`
	margin: 0;
	position: absolute;
	top: 0;
	right: 0;
	background: ${colors.aoc};

	label {
		width: 70px;
		display: inline-block;
	}

	p {
		margin: 10px;
	}
`

const Button = styled.button`
	border: solid 2px white;
	color: white;
	background: ${colors.aoc};
	margin-right: 10px;
	width: 40px;
	height: 40px;
	font-weight: bold;
	cursor: pointer;

	&:hover {
		color: ${colors.importantColor};
		border-color: ${colors.importantColor};
	}
`

type StatsProps = {
	stats: string
	onChangeSpeed?: (value: number) => void
	onReload?: () => void
}

const Stats = ({
	stats,
	onChangeSpeed = () => {},
	onReload = () => {},
}: StatsProps) => {
	const [statsVisibility, setStatsVisibility] = useState<boolean>(false)

	return (
		<Wrapper
			onMouseOver={() => setStatsVisibility(true)}
			onMouseOut={() => setStatsVisibility(false)}
			style={{
				opacity: statsVisibility ? 1 : 0.4,
				zIndex: statsVisibility ? 10 : 0,
			}}
		>
			<Container
				dangerouslySetInnerHTML={{
					__html: stats,
				}}
			/>
			<p>Commands : </p>

			<p>
				<label>Reload</label>
				<Button
					onClick={e => {
						e.stopPropagation()
						onReload()
					}}
				>
					R
				</Button>
			</p>
			<p>
				<label>Speed</label>
				<Button
					onClick={e => {
						e.stopPropagation()
						onChangeSpeed(5)
					}}
				>
					-
				</Button>
				<Button
					onClick={e => {
						e.stopPropagation()
						onChangeSpeed(-5)
					}}
				>
					+
				</Button>
			</p>
		</Wrapper>
	)
}

export default Stats
