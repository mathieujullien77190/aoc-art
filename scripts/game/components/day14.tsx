/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers, useScale } from "./hooks"
import { generateViews, clipSize } from "../core/day14"
import { View } from "../view"

import Stats from "./Stats"
import Controller from "./Controls"

const Game = styled.pre<{ scale: number }>`
	margin: 0;

	color: lightgray;

	transform: ${({ scale }) => `scale(${scale})`};

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
	align-items: center;
	justify-content: center;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [dataSize] = useState<number>(100)
	const [reload, setReload] = useState<number>(0)

	const scale = useScale(clipSize * 14)

	const { out, stats } = useAnim<View>({
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

		data: { speed, reload, dataSize: dataSize },
	})

	return (
		<>
			<Container>
				<Game scale={scale} dangerouslySetInnerHTML={{ __html: out?.value }} />
				<Controller
					controls={[
						{ name: "reload" },
						{ name: "speed", min: 0, max: 1000, value: speed },
					]}
					onChange={(name, value) => {
						if (name === "speed") setSpeed(value as number)
						if (name === "reload") setReload(value as number)
					}}
				/>
			</Container>
			<Stats stats={stats} />
		</>
	)
}

export default Animation
