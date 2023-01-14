/** @format */
import { useState } from "react"
import styled from "styled-components"

import { useAnim, prepareViewsHelpers } from "_games/components/hooks"
import { generateViews } from "_games/core/day9"

import { View } from "_games/helpers/types"

import Stats from "_games/components/Stats"
import Controller from "_games/components/Controls"
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
		data: { speed, reload, dataSize: dataSize },
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
			</>
		</Wrapper>
	)
}

export default Animation
