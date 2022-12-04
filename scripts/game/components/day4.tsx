/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim } from "./hooks"
import { generateViews } from "../core/day4"

import Stats from "./Stats"

import { isMobile } from "react-device-detect"

const Game = styled.pre`
	margin: 0;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [dataSize, setDataSize] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)
	const { HTML, stats } = useAnim({
		viewsFn: () => generateViews(25, dataSize),
		speed,
		reload,
		dataSize,
	})

	return (
		<>
			<Game dangerouslySetInnerHTML={{ __html: HTML }} />
			{!isMobile && (
				<Stats
					stats={stats}
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
