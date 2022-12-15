/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "./hooks"
import { generateViews } from "../core/day14"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
	font-size: 12px;
	line-height: 8px;
	color: lightgray;

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
	const [speed, setSpeed] = useState<number>(5)
	const [dataSize] = useState<number>(100)
	const [reload] = useState<number>(0)
	const { HTML, stats } = useAnim({
		viewsFn: () => prepareViewsHelpers(() => generateViews(), true),
		transform: ({ view, i }) => {
			const newView = {
				...view,
				value: view.value.replace(
					/([o]+)/g,
					'<span style="color:#ffa600">$1</span>'
				),
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
				sizeData={100}
				speed={speed}
				onChangeSpeed={setSpeed}
			/>
		</>
	)
}

export default Animation
