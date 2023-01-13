/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews } from "_games/core/day4"

import { View } from "_games/helpers/view"

import Stats from "_games/components/Stats"
import Controller from "_games/components/Controls"

const Game = styled.pre`
	margin: 0;
`

const Container = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [dataSize, setDataSize] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)
	const { out, stats } = useAnim<View>({
		viewsFn: () => prepareViewsHelpers(() => generateViews(25, dataSize), true),
		data: { speed, reload, dataSize },
	})

	return (
		<>
			<Container>
				<Game dangerouslySetInnerHTML={{ __html: out?.value }} />
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
			</Container>

			<Stats stats={stats} />
		</>
	)
}

export default Animation
