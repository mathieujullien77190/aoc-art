/** @format */
import { useState } from "react"
import styled from "styled-components"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import { data } from "_games/data/2021"

import Stats from "_games/components/Stats"
import Controller from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"

const Game = styled.pre`
	font-size: 10px;
	line-height: 6px;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)

	const { out, stats } = useAnim<string>({
		viewsFn: () => prepareViewsHelpers(() => data, false),
		data: { speed, reload },
	})

	return (
		<Wrapper game={<Game>{out}</Game>} debounce={100}>
			<>
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
				<Stats stats={stats} />
			</>
		</Wrapper>
	)
}

export default Animation
