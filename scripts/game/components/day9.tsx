/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers, useScale } from "./hooks"
import { generateViews } from "../core/day9"

import { View } from "../view"

import Stats from "./Stats"
import Controller from "./Controls"

const Game = styled.pre<{ scale: number }>`
	margin: 0;
	font-size: 12px;
	line-height: 8px;
	transform: ${({ scale }) => `scale(${scale})`};

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
	const [dataSize, setDataSize] = useState<number>(50)
	const [reload, setReload] = useState<number>(0)

	const scale = useScale(650)

	const { out, stats } = useAnim<View>({
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
		data: { speed, reload, dataSize: dataSize },
	})

	return (
		<>
			<Container>
				<Game dangerouslySetInnerHTML={{ __html: out?.value }} scale={scale} />
			</Container>
			<Stats stats={stats} />
			<Controller
				controls={[
					{ name: "speed", min: 0, max: 1000, value: speed },
					{ name: "data", min: 0, max: 100, value: dataSize },
				]}
				onChange={(name, value) => {
					if (name === "speed") setSpeed(value as number)
					if (name === "data") setDataSize(value as number)
				}}
			/>
		</>
	)
}

export default Animation
