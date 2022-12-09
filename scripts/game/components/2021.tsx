/** @format */
import { useState } from "react"
import styled from "styled-components"
import { useAnim, prepareViewsHelpers } from "./hooks"

import { data } from "../data/2021"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)

	const [reload, setReload] = useState<number>(0)

	const { HTML, stats } = useAnim({
		viewsFn: () =>
			prepareViewsHelpers(() => data.map(item => ({ value: item })), false),
		speed,
		reload,
	})

	return (
		<>
			<Game style={{ fontSize: "10px", lineHeight: "6px" }}>{HTML}</Game>

			<Stats
				stats={stats}
				speed={speed}
				onChangeSpeed={setSpeed}
				onReload={setReload}
			/>
		</>
	)
}

export default Animation
