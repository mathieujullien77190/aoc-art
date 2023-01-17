/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews } from "_games/core/day9"

import { View } from "_games/helpers/types"

import Stats from "_games/components/Stats"
import Controller, { AnimationValue } from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"

const Game = styled.pre`
	margin: 0;
	font-size: 12px;
	line-height: 8px;

	span {
		font-size: 12px;
		line-height: 8px;
	}
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(20)
	const [dataSize, setDataSize] = useState<number>(50)
	const [reload, setReload] = useState<number>(0)
	const [pause, setPause] = useState<boolean>(false)

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
		data: { dataSize },
		control: { pause, reload, speed },
	})

	return (
		<Wrapper
			game={<Game dangerouslySetInnerHTML={{ __html: out?.value }} />}
			debounce={100}
		>
			<>
				<Stats stats={stats} />
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
			</>
		</Wrapper>
	)
}

export default Animation
