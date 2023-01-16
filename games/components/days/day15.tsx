/** @format */
import { useState } from "react"
import styled from "styled-components"
import { isMobile } from "react-device-detect"

import { mapView, init } from "_games/core/day15"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import { colors } from "_components/constants"
import { View } from "_games/helpers/types"

import Stats from "_games/components/Stats"
import Controller from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"

const Game = styled.pre`
	margin: 0;
	font-size: 6px;
	line-height: 6px;
	padding: 10px;

	span.path {
		color: red;
		font-size: 6px;
		line-height: 6px;
	}
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)

	const { out, stats } = useAnim<View>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(mapView)
			}, true),
		data: { speed, reload },
	})

	return (
		<Wrapper
			game={
				<Game
					dangerouslySetInnerHTML={{
						__html: out?.value?.replace(
							/(#+)/g,
							'<span class="path">$1</span>'
						),
					}}
				/>
			}
			debounce={100}
		>
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
