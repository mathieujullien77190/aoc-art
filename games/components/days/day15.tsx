/** @format */
import { useState } from "react"
import styled from "styled-components"

import { mapView, init } from "_games/core/day15"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import { View } from "_games/helpers/types"

import Stats from "_games/components/Stats"
import Controller, { AnimationValue } from "_games/components/Controls"
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
	const [reload, setReload] = useState<number>(1)
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<View>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(mapView)
			}, true),
		control: { pause, reload, speed },
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
						{
							name: "animation",
							speed,
							pause,
							reload,
						},
					]}
					onChange={(name, value) => {
						if (name === "animation") {
							setSpeed((value as AnimationValue).speed)
							setReload((value as AnimationValue).reload)
							setPause((value as AnimationValue).pause)
						}
					}}
				/>

				<Stats stats={stats} />
			</>
		</Wrapper>
	)
}

export default Animation
