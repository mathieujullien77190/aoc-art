/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews } from "_games/core/day2023_1"

import Stats from "_games/components/Stats"
import Controller, { AnimationValue } from "_games/components/Controls"
import { Wrapper } from "_games/components/Containers"

const Game = styled.pre`
	margin: 0;
	transform: scale(0.9);
	text-align: center;
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(100)
	const [reload, setReload] = useState<number>(0)
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<{ value: string }>({
		viewsFn: () => prepareViewsHelpers(() => generateViews(), true),
		control: { pause, reload, speed },
		transform: ({ view, i }) => {
			const newView = {
				...view,
				value: view.value
					.replace(/(~)([0-9]{2})(~)/g, '<span style="color:orange">$2</span>')
					.replace(
						/(~)([0-9]{3})(~)/g,
						'<span style="color:orange;font-size:20px;">$2</span>'
					)
					.replace(
						/(~)([0-9]{4})(~)/g,
						'<span style="color:orange;font-size:30px;">$2</span>'
					)
					.replace(
						/(~)([0-9]{5})(~)/g,
						'<span style="color:orange;font-size:40px;">$2</span>'
					)
					.replace(/(@)([0-9])(@)/g, '<span style="color:yellow">$2</span>')
					.replace(/(#)([0-9])(#)/g, '<span style="color:red">$2</span>')
					.replace(/[\n]{3}/g, ""),
			}

			return {
				view: newView,
				i,
			}
		},
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
