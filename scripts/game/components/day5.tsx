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

const Animation = () => {
	const [speed, setSpeed] = useState<number>(15)

	const [reload, setReload] = useState<number>(0)
	const { HTML, stats } = useAnim({
		viewsFn: () => generateViews(10),
		speed,
		reload,
		dataSize: 10,
	})

	return (
		<>
			<Game
				style={{ fontSize: "14px" }}
				dangerouslySetInnerHTML={{ __html: HTML }}
			/>
			{!isMobile && (
				<Stats
					stats={stats}
					maxData={10}
					onChangeSpeed={value =>
						setSpeed(n =>
							n + value > 1000 ? 1000 : n + value <= 0 ? 0 : n + value
						)
					}
					onReload={() => setReload(n => n + 1)}
				/>
			)}
		</>
	)
}

export default Animation
