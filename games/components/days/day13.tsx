/** @format */
import { useEffect, useState } from "react"
import styled from "styled-components"

import { View } from "_games/helpers/types"
import { init, data } from "_games/core/day13"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import { colors } from "_components/constants"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"

const Pre = styled.pre`
	margin: 0;
	border: solid 1px gray;
	font-size: 10px;
	line-height: 10px;
`

const Container = styled.div``

const Line = styled.div`
	display: inline-flex;
`

const Animation = () => {
	const [pages, setPages] = useState<View[][]>()

	useEffect(() => {
		setPages(init(data))
	}, [])

	return (
		<WrapperContainer3D>
			<D3
				size={1000}
				margin={-100}
				zoom={{ value: 8, min: 1, max: 20, step: 1, bigStep: 2 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				addControl={[
					{ name: "speed", value: 50, min: 0, max: 1000 },
					{ name: "reload" },
				]}
				start={{ H: 10, V: 300 }}
			>
				<>
					{pages && (
						<>
							<Line>
								<Pre dangerouslySetInnerHTML={{ __html: pages[0][0].value }} />
							</Line>

							{/* <Line>
								<Pre dangerouslySetInnerHTML={{ __html: pages[1][0].value }} />
							</Line> */}
						</>
					)}
				</>
			</D3>
		</WrapperContainer3D>
	)
}

export default Animation

// transform: rotateY(180deg);
//     transform-origin: center right;
