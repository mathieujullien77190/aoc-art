/** @format */
import { useCallback, useState } from "react"
import styled from "styled-components"

import { colors } from "_components/constants"

import { isMobile } from "react-device-detect"

let RELOAD = 0

const Container = styled.div`
	label {
		width: 190px;
		display: inline-block;
	}
`

const Commands = styled.div`
	label {
		width: 95px;
		display: inline-block;
	}

	> div {
		margin: 5px;
	}
`

const Wrapper = styled.div`
	margin: 30px 10px;
	position: absolute;
	top: 0;
	right: 0;
	background: ${colors.aoc};
	border: dashed 2px;
	padding: 10px;

	p {
		font-weight: bold;
	}
`

const Button = styled.button<{ active?: boolean }>`
	border: solid 2px;
	color: ${({ active }) => (active ? colors.importantColor : "white")};
	border-color: ${({ active }) => (active ? colors.importantColor : "white")};
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
	stats: Record<string, number>
	part?: 1 | 2
	maxSpeed?: number
	speed?: number
	maxSizeData?: number
	minSizeData?: number
	sizeData?: number
	onChangeSpeed?: (value: number) => void
	onChangeSize?: (value: number) => void
	onReload?: (value: number) => void
	onPart?: (value: 1 | 2) => void
}

const Stats = ({
	stats,
	part = 1,
	maxSizeData = 100,
	minSizeData = 0,
	sizeData = 40,
	maxSpeed = 1000,
	speed = 50,
	onChangeSpeed = () => {},
	onChangeSize = null,
	onReload = null,
	onPart = null,
}: StatsProps) => {
	const [statsVisibility, setStatsVisibility] = useState<boolean>(false)

	const handleChangeSpeed = useCallback(
		(value: number) => {
			onChangeSpeed(
				speed + value > maxSpeed
					? maxSpeed
					: speed + value <= 0
					? 0
					: speed + value
			)
		},
		[speed, maxSpeed]
	)

	const handleChangeSize = useCallback(
		(value: number) => {
			onChangeSize(
				sizeData + value > maxSizeData
					? maxSizeData
					: sizeData + value <= minSizeData
					? minSizeData
					: sizeData + value
			)
		},
		[sizeData, maxSizeData]
	)

	return (
		<>
			{!isMobile && (
				<Wrapper
					onMouseOver={() => setStatsVisibility(true)}
					onMouseOut={() => setStatsVisibility(false)}
					style={{
						opacity: statsVisibility ? 1 : 0.2,
						zIndex: statsVisibility ? 10 : 0,
					}}
				>
					<Container>
						<p>Informations</p>
						{stats?.timeViews && (
							<div>
								<label>Time generation</label>
								{stats?.timeViews}s
							</div>
						)}
						{stats?.nbViewSec && (
							<div>
								<label>Generation frames/s</label>
								{stats?.nbViewSec?.toLocaleString()}
							</div>
						)}
						<div>
							<label>Total frame</label>
							{stats?.totalView?.toLocaleString()}
						</div>
						<div>
							<label>Frame displayed</label>
							{stats?.nbsView?.toLocaleString()}
						</div>
						<div>
							<label>Current frame</label>
							{stats?.countView?.toLocaleString()}
						</div>
						<div>
							<label>Char displayed</label>
							{stats?.countChar?.toLocaleString()}
						</div>

						{stats?.dataSize && (
							<div>
								<label>% data</label>
								{stats?.dataSize}%
							</div>
						)}
						<div>
							<label>Speed</label>
							{stats?.speed}
						</div>
					</Container>
					<Commands>
						<p>Commands : </p>
						{onReload && (
							<div>
								<label>Action</label>
								<Button
									onClick={e => {
										e.stopPropagation()
										onReload(RELOAD++)
									}}
								>
									Reload
								</Button>
							</div>
						)}
						{onPart && (
							<div>
								<label>Partie</label>
								<Button
									active={part === 1}
									onClick={e => {
										e.stopPropagation()
										onPart(1)
									}}
								>
									1
								</Button>
								<Button
									active={part === 2}
									onClick={e => {
										e.stopPropagation()
										onPart(2)
									}}
								>
									2
								</Button>
							</div>
						)}
						<div>
							<label>Speed</label>
							<Button
								onClick={e => {
									e.stopPropagation()
									handleChangeSpeed(5)
								}}
							>
								-
							</Button>
							<Button
								onClick={e => {
									e.stopPropagation()
									handleChangeSpeed(-5)
								}}
							>
								+
							</Button>
							<Button
								onClick={e => {
									e.stopPropagation()
									handleChangeSpeed(-maxSpeed)
								}}
							>
								max
							</Button>
							<Button
								onClick={e => {
									e.stopPropagation()
									handleChangeSpeed(maxSpeed)
								}}
							>
								min
							</Button>
						</div>
						{onChangeSize && (
							<div>
								<label>Data size</label>
								<Button
									onClick={e => {
										e.stopPropagation()
										handleChangeSize(-10)
									}}
								>
									-
								</Button>
								<Button
									onClick={e => {
										e.stopPropagation()
										handleChangeSize(10)
									}}
								>
									+
								</Button>
								<Button
									onClick={e => {
										e.stopPropagation()
										handleChangeSize(maxSizeData)
									}}
								>
									max
								</Button>
								<Button
									onClick={e => {
										e.stopPropagation()
										handleChangeSize(-maxSizeData)
									}}
								>
									min
								</Button>
							</div>
						)}
					</Commands>
				</Wrapper>
			)}
		</>
	)
}

export default Stats
