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
		width: 95px;
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
	min-width: 40px;
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
	maxData?: number
	onChangeSpeed?: (value: number) => void
	onChangeSize?: (value: number) => void
	onReload?: () => void
}

const Stats = ({
	stats,
	maxData = 100,
	onChangeSpeed = () => {},
	onChangeSize = null,
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
				<label>Action</label>
				<Button
					onClick={e => {
						e.stopPropagation()
						onReload()
					}}
				>
					Reload
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
				<Button
					onClick={e => {
						e.stopPropagation()
						onChangeSpeed(-1000)
					}}
				>
					max
				</Button>
				<Button
					onClick={e => {
						e.stopPropagation()
						onChangeSpeed(1000)
					}}
				>
					min
				</Button>
			</p>
			{onChangeSize && (
				<p>
					<label>Data size</label>
					<Button
						onClick={e => {
							e.stopPropagation()
							onChangeSize(-10)
						}}
					>
						-
					</Button>
					<Button
						onClick={e => {
							e.stopPropagation()
							onChangeSize(10)
						}}
					>
						+
					</Button>
					<Button
						onClick={e => {
							e.stopPropagation()
							onChangeSize(maxData)
						}}
					>
						max
					</Button>
					<Button
						onClick={e => {
							e.stopPropagation()
							onChangeSize(-maxData)
						}}
					>
						min
					</Button>
				</p>
			)}
		</Wrapper>
	)
}

export default Stats
