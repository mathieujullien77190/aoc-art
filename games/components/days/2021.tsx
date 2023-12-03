/** @format */
import { useState } from "react"
import styled from "styled-components"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import { generateViews } from "_games/core/2021"

import Stats from "_games/components/Stats"
import Controller, { AnimationValue } from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"
import { View } from "_games/helpers/types"

const Game = styled.pre`
	font-size: 10px;
	line-height: 6px;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [reload, setReload] = useState<number>(0)

	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<View>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return generateViews()
			}, true),

		control: { pause, reload, speed },
	})

	return (
		<Wrapper
			game={<Game dangerouslySetInnerHTML={{ __html: out?.value }} />}
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
