/** @format */
import { useEffect, useRef, useState, memo } from "react"
import styled from "styled-components"
import { isMobile } from "react-device-detect"

import { data, init } from "../core/day12"
import { useAnim, prepareViewsHelpers } from "./hooks"

import D3 from "./D3"
import Stats from "./Stats"

import { createArray } from "../helpers"

const Wrapper = styled.div`
	margin: 0;
	height: 100%;
	overflow: hidden;
`

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
	color: ${({ z }) => `hsl(28deg, 100%, ${Math.abs((z - 27) * 3 - 19)}%)`};

	pre {
		margin: 0;

		span.s {
			color: ${({ z }) => `hsl(0deg, 55%, ${Math.abs((z - 27) * 3 - 19)}%)`};
		}
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

const Plans = memo(() => {
	return (
		<>
			{createArray(28).map((_, i) => (
				<Plan className={`z${i}`} draw={""} z={i} key={i} />
			))}
		</>
	)
})

type PlanProps = {
	draw: string
	z: number
	className: string
}

const Plan = ({ draw, z, className }: PlanProps) => {
	const formatDraw = draw

		.replace(/(\*+)/g, '<span class="s">$1</span>')
		.replace(/(@+)/g, '<span class="t">$1</span>')

	return (
		<PlanContainer z={z} className={className}>
			<pre dangerouslySetInnerHTML={{ __html: formatDraw }}></pre>
		</PlanContainer>
	)
}

const Animation = () => {
	const [speed, setSpeed] = useState<number>(50)
	const [reload] = useState<number>(0)

	const { out, stats } = useAnim<Record<string, string>>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(data)
			}, true),
		data: { speed, reload },
	})

	useEffect(() => {
		if (out) {
			for (let key in out) {
				document.querySelector(`.${key} pre`).innerHTML = out[key]
					.replace(/(\*+)/g, '<span class="s">$1</span>')
					.replace(/(@+)/g, '<span class="t">$1</span>')
			}
		}
	}, [out])

	return (
		<Wrapper>
			<D3
				size={600}
				margin={-100}
				zoom={{ value: isMobile ? 4 : 8, min: 1, max: 20, step: 1, bigStep: 2 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				start={{ H: 10, V: 300 }}
			>
				<>
					<Plans />
					<Explain>
						<span>Résolution via de l'algorithme de dijkstra</span>
					</Explain>
				</>
			</D3>

			<Stats stats={stats} />
		</Wrapper>
	)
}

export default Animation
