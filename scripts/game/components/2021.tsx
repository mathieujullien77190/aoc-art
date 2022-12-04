/** @format */
import { useState } from "react"
import styled from "styled-components"
import { useAnim } from "./hooks"

import { data } from "../data/2021"

import Stats from "./Stats"

import { isMobile } from "react-device-detect"

const Game = styled.pre`
	margin: 0;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)

	const [html, stats] = useAnim({ viewsFn: () => data, speed, reload })

	return (
		<>
			<Game style={{ fontSize: "10px", lineHeight: "6px", margin: 0 }}>
				{html}
			</Game>
			{!isMobile && (
				<Stats
					stats={stats}
					onChangeSpeed={value => setSpeed(n => n + value)}
					onReload={() => setReload(n => n + 1)}
				/>
			)}
		</>
	)
}

export default Animation
