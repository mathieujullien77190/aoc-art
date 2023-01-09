/** @format */

import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { colors } from "_components/constants"

import { isMobile } from "react-device-detect"

import { organize, goN, map, actions, draw, setPosition } from "../core/day22"
import { useAnim, prepareViewsHelpers } from "./hooks"

import D3 from "./D3"
import Stats from "./Stats"

const PlanContainer = styled.div<{
	size: number
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 15px;
	line-height: 15px;
	position: absolute;
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};

	transform: ${({ size }) => `translateZ(${size}px)`};
	background: black;

	border: solid 1px gray;

	pre {
		margin: 0;
		font-size: 14px;
		margin-left: 0px;
		line-height: 20px;
		letter-spacing: 12px;
	}

	&.front {
		transform: ${({ size }) => `rotateY(0deg) translateZ(${size / 2}px)`};
	}
	&.right {
		transform: ${({ size }) => `rotateY(90deg) translateZ(${size / 2}px) `};
	}
	&.back {
		transform: ${({ size }) =>
			`rotateX(-180deg) translateZ(${size / 2}px) rotateZ(0deg)`};
	}
	&.left {
		transform: ${({ size }) =>
			`rotateY(-90deg) translateZ(${size / 2}px) rotateZ(180deg)`};
	}
	&.top {
		transform: ${({ size }) =>
			`rotateX(90deg) translateZ(${size / 2}px) rotateZ(-90deg)`};
	}
	&.bottom {
		transform: ${({ size }) => `rotateX(-90deg) translateZ(${size / 2}px)`};
	}
`

type PlanProps = {
	draw: string
	size: number
	position: string
}

const Plan = ({ draw, size, position }: PlanProps) => {
	const formatDraw = draw.replace(/(\.)/g, " ")

	return (
		<PlanContainer size={size} className={position}>
			<pre>{formatDraw}</pre>
		</PlanContainer>
	)
}

const size = 1000

const Animation = () => {
	const [speed, setSpeed] = useState<number>(30)
	const [reload] = useState<number>(0)

	const { out, stats } = useAnim<{ cube: Record<string, string>; meta: any }>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				const cube = organize(draw)
				return goN(cube, map, actions, { x: 0, y: 0 }, "01")
			}, true),
		data: { speed, reload },
	})

	return (
		<>
			<D3
				size={size}
				margin={-100}
				zoom={{ value: 3, min: 1, max: 20, step: 1, bigStep: 2 }}
				start={{ H: 30, V: 320 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
			>
				{out && (
					<>
						<Plan draw={out.cube["01"]} size={size} position="front" />
						<Plan draw={out.cube["02"]} size={size} position="right" />
						<Plan draw={out.cube["11"]} size={size} position="bottom" />
						<Plan draw={out.cube["21"]} size={size} position="back" />
						<Plan draw={out.cube["20"]} size={size} position="left" />
						<Plan draw={out.cube["30"]} size={size} position="top" />
					</>
				)}
			</D3>
			<Stats
				stats={stats}
				sizeData={100}
				speed={speed}
				onChangeSpeed={setSpeed}
			/>
		</>
	)
}

export default Animation
