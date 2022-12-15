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
	margin: 10px;
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
	stats: Record<string, number>
	maxSpeed?: number
	speed?: number
	maxSizeData?: number
	minSizeData?: number
	sizeData?: number
	onChangeSpeed?: (value: number) => void
	onChangeSize?: (value: number) => void
	onReload?: (value: number) => void
}

const Stats = ({
	stats,
	maxSizeData = 100,
	minSizeData = 0,
	sizeData = 40,
	maxSpeed = 1000,
	speed = 50,
	onChangeSpeed = () => {},
	onChangeSize = null,
	onReload = null,
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
						opacity: statsVisibility ? 1 : 0.4,
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
