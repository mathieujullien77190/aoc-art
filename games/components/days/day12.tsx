/** @format */
import { useState } from "react"
import styled from "styled-components"
import { isMobile } from "react-device-detect"

import { ViewPlan } from "_games/helpers/types"
import { mapView, init } from "_games/core/day12"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import { colors } from "_components/constants"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"

const PlanContainer = styled.div<{
	z: number
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 15px;
	line-height: 15px;
	position: absolute;
	transform: ${({ z }) => `rotateX(90deg) translateZ(${z * 3}px)`};
	color: ${({ z }) => {
		if (z === 0) return "white"
		if (z === 1) return colors.infoColor
		if (z === 2) return "#e8ffc5"
		if (z === 3) return colors.cmdColor
		return `hsl(28deg, 100%, ${Math.abs((z - 27) * 3 - 19)}%)`
	}};
	pre {
		margin: 0;

		span.t {
			color: red;
			font-weight: bold;
		}
	}
`

const Explain = styled.div`
	width: 100%;
	height: 100%;
	transform: rotateX(90deg) rotateZ(0deg) translateZ(90px);
	display: flex;
	justify-content: center;
	align-items: end;
	span {
		background-color: black;
		padding: 10px;
		font-weight: bold;
	}
`

type PlanProps = {
	draw: string
	z: number
}

const Plan = ({ draw, z }: PlanProps) => {
	const formatDraw = draw.replace(/(@+)/g, '<span class="t">$1</span>')

	return (
		<PlanContainer z={z}>
			<pre dangerouslySetInnerHTML={{ __html: formatDraw }}></pre>
		</PlanContainer>
	)
}

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)
	const [meta, setMeta] = useState<string>("")

	const { out, stats } = useAnim<{ plans: ViewPlan; meta: string }>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(mapView)
			}, true),
		data: { speed, reload },
		action: ({ view }) => {
			setMeta(view.meta)
		},
	})

	return (
		<WrapperContainer3D>
			<D3
				size={600}
				margin={-100}
				zoom={{ value: isMobile ? 4 : 8, min: 1, max: 20, step: 1, bigStep: 2 }}
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
				onControlChange={(name: string, value) => {
					if (name === "reload") setReload(value)
					if (name === "speed") setSpeed(value)
				}}
			>
				<>
					{out &&
						out.plans.value.map((draw, i) => (
							<Plan draw={draw} z={i} key={i} />
						))}
					<Explain>
						<span>{meta}</span>
					</Explain>
				</>
			</D3>

			<Stats stats={stats} />
		</WrapperContainer3D>
	)
}

export default Animation
