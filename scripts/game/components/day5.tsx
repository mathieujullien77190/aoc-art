/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim } from "./hooks"
import { generateViews } from "../core/day5"

import Stats from "./Stats"

import { isMobile } from "react-device-detect"

const Game = styled.pre`
	margin: 0;
`

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: end;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [dataSize, setDataSize] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)
	const { HTML, stats } = useAnim({
		viewsFn: () => generateViews(dataSize),
		speed,
		reload,
		dataSize: dataSize,
	})

	return (
		<>
			<Container>
				<Game
					style={{ fontSize: "12px" }}
					dangerouslySetInnerHTML={{ __html: HTML }}
				/>
			</Container>
			{!isMobile && (
				<Stats
					stats={stats}
					maxData={100}
					onChangeSpeed={value =>
						setSpeed(n =>
							n + value > 1000 ? 1000 : n + value <= 0 ? 0 : n + value
						)
					}
					onReload={() => setReload(n => n + 1)}
					onChangeSize={value =>
						setDataSize(n =>
							n + value > 100 ? 100 : n + value <= 0 ? 0 : n + value
						)
					}
				/>
			)}
		</>
	)
}

export default Animation
