/** @format */
import { useState } from "react"
import styled from "styled-components"
import { useAnim, prepareViewsHelpers } from "./hooks"

import { data } from "../data/2021"

import { View } from "../view"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)

	const [reload, setReload] = useState<number>(0)

	const { out, stats } = useAnim<View>({
		viewsFn: () =>
			prepareViewsHelpers(() => data.map(item => ({ value: item })), false),
		data: { speed, reload },
	})

	return (
		<>
			<Game style={{ fontSize: "10px", lineHeight: "6px" }}>{out?.value}</Game>

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
