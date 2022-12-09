/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "./hooks"
import { generateViews } from "../core/day9"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
	font-size: 12px;
	line-height: 8px;

	span {
		font-size: 12px;
		line-height: 8px;
	}
`

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: end;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(10)
	const [dataSize, setDataSize] = useState<number>(50)
	const [reload, setReload] = useState<number>(0)
	const { HTML, stats } = useAnim({
		viewsFn: () => prepareViewsHelpers(() => generateViews(dataSize, 9), true),
		transform: ({ view, i }) => {
			const newView = {
				...view,
				value: view.value
					.replace(/(\.)/g, '<span style="color:yellow">$1</span>')

					.replace(/(\%)/g, '<span style="color:red">$1</span>'),
			}

			return {
				view: newView,
				i,
			}
		},
		speed,
		reload,
		dataSize: dataSize,
	})

	return (
		<>
			<Container>
				<Game dangerouslySetInnerHTML={{ __html: HTML }} />
			</Container>
			<Stats
				stats={stats}
				minSizeData={10}
				maxSizeData={50}
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
