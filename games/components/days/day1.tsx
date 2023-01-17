/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews, extractMax } from "_games/core/day1"

import Stats from "_games/components/Stats"
import Controller, { AnimationValue } from "_games/components/Controls"
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
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<string>({
		viewsFn: () => prepareViewsHelpers(() => generateViews(60, dataSize), true),
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
		data: { dataSize },
		control: { pause, reload, speed },
	})

	return (
		<>
			<Wrapper
				game={<Game dangerouslySetInnerHTML={{ __html: out }} />}
				debounce={100}
			>
				<>
					<Controller
						controls={[
							{
								name: "animation",
								speed,
								pause,
								reload,
							},
							{ name: "data", min: 0, max: 100, value: dataSize },
						]}
						onChange={(name, value) => {
							if (name === "animation") {
								setSpeed((value as AnimationValue).speed)
								setReload((value as AnimationValue).reload)
								setPause((value as AnimationValue).pause)
							}
							if (name === "data") setDataSize(value as number)
						}}
					/>
					<Stats stats={stats} />
				</>
			</Wrapper>
		</>
	)
}

export default Animation
