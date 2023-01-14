/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews, extractMax } from "_games/core/day1"

import { View } from "_games/helpers/view"

import Stats from "_games/components/Stats"
import Controller from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"

const Game = styled.pre`
	margin: 0;
`

const pos = Math.floor(60 / 2) - 3

const Animation = () => {
	let theBest = 0
	const [speed, setSpeed] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)
	const [dataSize, setDataSize] = useState<number>(100)

	const { out, stats } = useAnim<View>({
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
			<Wrapper
				game={<Game dangerouslySetInnerHTML={{ __html: out?.value }} />}
				debounce={100}
			>
				<>
					<Controller
						controls={[
							{ name: "reload" },
							{ name: "speed", min: 0, max: 1000, value: speed },
							{ name: "data", min: 0, max: 100, value: dataSize },
						]}
						onChange={(name, value) => {
							if (name === "speed") setSpeed(value as number)
							if (name === "data") setDataSize(value as number)
							if (name === "reload") setReload(value as number)
						}}
					/>
					<Stats stats={stats} />
				</>
			</Wrapper>
		</>
	)
}

export default Animation
