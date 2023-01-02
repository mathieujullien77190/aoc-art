/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "./hooks"
import { generateViews } from "../core/day4"

import { View } from "../view"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [dataSize, setDataSize] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)
	const { out, stats } = useAnim<View>({
		viewsFn: () => prepareViewsHelpers(() => generateViews(25, dataSize), true),
		data: { speed, reload, dataSize },
	})

	return (
		<>
			<Game dangerouslySetInnerHTML={{ __html: out?.value }} />
			<Stats
				stats={stats}
				speed={speed}
				sizeData={dataSize}
				onChangeSpeed={setSpeed}
				onReload={setReload}
				onChangeSize={setDataSize}
			/>
		</>
	)
}

export default Animation
