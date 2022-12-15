/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "./hooks"
import { generateViews, extractMax } from "../core/day1"

import Stats from "./Stats"

const Game = styled.pre`
	margin: 0;
`

const pos = Math.floor(60 / 2) - 3

const Animation = () => {
	let theBest = 0
	const [speed, setSpeed] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)
	const [dataSize, setDataSize] = useState<number>(100)

	const { HTML, stats } = useAnim({
		viewsFn: () => prepareViewsHelpers(() => generateViews(60, dataSize), true),
		transform: ({ view, i }) => {
			const item1 = view.value.substring(0, pos)
			const item2 = view.value.substring(pos, pos + 6)
			const item3 = view.value.substring(pos + 6)

			theBest = extractMax(item2, theBest)

			return {
				view: {
					value: `${item1}<span style="color:red;">${item2}</span>${item3}\n\nScan : <span style="color:red;">${item2}</span>\nBest : ${theBest}`,
				},
				i,
			}
		},
		data: { speed, reload, dataSize },
	})

	return (
		<>
			<Game dangerouslySetInnerHTML={{ __html: HTML }} />
			<Stats
				speed={speed}
				sizeData={dataSize}
				stats={stats}
				onChangeSpeed={setSpeed}
				onReload={setReload}
				onChangeSize={setDataSize}
			/>
		</>
	)
}

export default Animation
