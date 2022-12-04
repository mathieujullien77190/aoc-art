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

	const [html, stats] = useAnim({
		viewsFn: () => generateViews(60),
		transform: ({ view, i }) => {
			const item1 = view.substring(0, pos)
			const item2 = view.substring(pos, pos + 6)
			const item3 = view.substring(pos + 6)

			theBest = extractMax(item2, theBest)

			return {
				view: `${item1}<span style="color:red;">${item2}</span>${item3}\n\nScan : <span style="color:red;">${item2}</span>\nBest : ${theBest}`,
				i,
			}
		},
		speed,
		reload,
	})

	return (
		<>
			<Game dangerouslySetInnerHTML={{ __html: html }} />
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
