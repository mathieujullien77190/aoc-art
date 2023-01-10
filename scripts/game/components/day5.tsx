/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers, useScale } from "./hooks"
import { generateViews } from "../core/day5"

import { View } from "../view"

import Stats from "./Stats"
import Controller from "./Controls"

const Game = styled.pre<{ scale: number }>`
	margin: 0;

	transform: ${({ scale }) => `scale(${scale})`};
`

const Container = styled.div`
	height: calc(100% - 90px);
	display: flex;
	align-items: end;
	justify-content: center;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(30)
	const [dataSize, setDataSize] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)
	const { out, stats } = useAnim<View>({
		viewsFn: () => prepareViewsHelpers(() => generateViews(dataSize), true),
		data: { speed, reload, dataSize: dataSize },
	})
	const scale = useScale(480)

	return (
		<>
			<Container>
				<Game
					style={{ fontSize: "12px" }}
					dangerouslySetInnerHTML={{ __html: out?.value }}
					scale={scale}
				/>
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
			</Container>
			<Stats stats={stats} />
		</>
	)
}

export default Animation
