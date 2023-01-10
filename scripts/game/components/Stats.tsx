/** @format */
import { useState } from "react"
import styled from "styled-components"

import { colors } from "_components/constants"

import { isMobile } from "react-device-detect"

const Container = styled.div`
	label {
		width: 190px;
		display: inline-block;
	}
`

const Wrapper = styled.div`
	margin: 30px 10px;
	position: absolute;
	top: 0;
	right: 0;
	background: ${colors.aoc};
	padding: 10px;

	p {
		font-weight: bold;
		margin: 0 0 10px 0;
	}
`

type StatsProps = {
	stats: Record<string, number>
}

const Stats = ({ stats }: StatsProps) => {
	const [statsVisibility, setStatsVisibility] = useState<boolean>(false)

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
				</Wrapper>
			)}
		</>
	)
}

export default Stats
