/** @format */
import { useState } from "react"
import styled from "styled-components"
import { useAnim, prepareViewsHelpers } from "./hooks"

import { data } from "../data/2021"

import { View } from "../view"

import Stats from "./Stats"
import Controller from "./Controls"

const Game = styled.pre`
	margin: 0;
	transform: scale(0.8);
`

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)

	const [reload, setReload] = useState<number>(0)

	const { out, stats } = useAnim<View>({
		viewsFn: () =>
			prepareViewsHelpers(() => data.map(item => ({ value: item })), false),
		data: { speed, reload },
	})

	return (
		<>
			<Container>
				<Game style={{ fontSize: "10px", lineHeight: "6px" }}>
					{out?.value}
				</Game>
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
