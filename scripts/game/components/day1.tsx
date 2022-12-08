/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim } from "./hooks"
import { generateViews, extractMax } from "../core/day1"

import Stats from "./Stats"

import { isMobile } from "react-device-detect"

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
		viewsFn: () => generateViews(60, dataSize),
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
