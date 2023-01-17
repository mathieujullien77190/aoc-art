/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews } from "_games/core/day14"
import { View } from "_games/helpers/types"

import Stats from "_games/components/Stats"
import Controller, { AnimationValue } from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"

const Game = styled.pre`
	margin: 0;
	color: lightgray;
	font-size: 12px;
	line-height: 8px;

	span {
		font-size: 12px;
		line-height: 8px;
	}
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [reload, setReload] = useState<number>(1)
	const [pause, setPause] = useState<boolean>(false)

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
