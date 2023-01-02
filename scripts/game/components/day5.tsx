/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "./hooks"
import { generateViews } from "../core/day5"

import { View } from "../view"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
`

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: end;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(30)
	const [dataSize, setDataSize] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)
	const { out, stats } = useAnim<View>({
		viewsFn: () => prepareViewsHelpers(() => generateViews(dataSize), true),
		data: { speed, reload, dataSize: dataSize },
	})

	return (
		<>
			<Container>
				<Game
					style={{ fontSize: "12px" }}
					dangerouslySetInnerHTML={{ __html: out?.value }}
				/>
			</Container>
			<Stats
				stats={stats}
				maxSizeData={100}
				minSizeData={10}
				sizeData={dataSize}
				speed={speed}
				onChangeSpeed={setSpeed}
				onReload={setReload}
				onChangeSize={setDataSize}
			/>
		</>
	)
}

export default Animation
