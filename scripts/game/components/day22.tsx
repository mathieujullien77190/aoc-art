/** @format */

import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { colors } from "_components/constants"

import { isMobile } from "react-device-detect"

import { organize, goN, map, actions, draw, setPosition } from "../core/day22"
import { useAnim, prepareViewsHelpers } from "./hooks"

import { D3Element } from "./D3Element"
import Stats from "./Stats"

const Debug = styled.span`
	position: absolute;
	top: 0;
	left: 0;
`

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

	pre {
		margin: 0;
		font-size: 26px;
		margin-left: ${({ size }) => `${size / 16 + 8}px`};
		letter-spacing: ${({ size }) => `${size / 8}px`};
		line-height: ${({ size }) => `${size / 4}px`};
	}

	&.front {
		background: hsla(0, 100%, 50%, 0.7);
		transform: ${({ size }) => `rotateY(0deg) translateZ(${size / 2}px)`};
	}
	&.right {
		background: hsla(0, 0%, 50%, 0.7);
		transform: ${({ size }) =>
			`rotateY(90deg) translateZ(${size / 2}px) rotateZ(180deg)`};
	}
	&.back {
		background: hsla(120, 100%, 50%, 0.7);
		transform: ${({ size }) =>
			`rotateY(180deg) translateZ(${size / 2}px) rotateZ(180deg)`};
	}
	&.left {
		background: hsla(180, 100%, 50%, 0.7);
		transform: ${({ size }) =>
			`rotateY(-90deg) translateZ(${size / 2}px) rotateZ(90deg)`};
	}
	&.top {
		background: hsla(240, 100%, 50%, 0.7);
		transform: ${({ size }) =>
			`rotateX(90deg) translateZ(${size / 2}px) rotateZ(180deg)`};
	}
	&.bottom {
		background: hsla(300, 100%, 50%, 0.7);
		transform: ${({ size }) => `rotateX(-90deg) translateZ(${size / 2}px)`};
	}
`

type PlanProps = {
	draw: string
	size: number
	position: string
}

const Plan = ({ draw, size, position }: PlanProps) => {
	const formatDraw = draw
	// 	.replace(/(x+)/g, '<span class="in">$1</span>')
	// 	.replace(/(\.+)/g, '<span class="out">$1</span>')

	return (
		<PlanContainer size={size} className={position}>
			<Debug>{position}</Debug>
			<pre dangerouslySetInnerHTML={{ __html: formatDraw }}></pre>
		</PlanContainer>
	)
}

const size = 200

let curr

const Animation = () => {
	const [speed, setSpeed] = useState<number>(500)
	const [reload] = useState<number>(0)

	const [H, setH] = useState<number>(0)
	const [V, setV] = useState<number>(0)
	const [Z, setZ] = useState<number>(0)

	const { out, stats } = useAnim<{ cube: Record<string, string>; meta: any }>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				const cube = organize(draw)
				return goN(cube, map, actions, { x: 0, y: 0 }, "02")
			}, true),
		action: ({ view }) => {
			// if (curr) {
			// 	if (curr.face !== view.meta.face) {
			// 		if (curr.action.dir === ">") setH(prev => prev + 90)
			// 		if (curr.action.dir === "v") setV(prev => prev + 90)
			// 		if (curr.action.dir === "<") setH(prev => prev - 90)
			// 		if (curr.action.dir === "^") setV(prev => prev - 90)
			// 	}
			// }
			// curr = view.meta
		},
		data: { speed, reload },
	})

	return (
		<>
			<D3Element
				size={size}
				margin={-100}
				control={{ mouse: true, keyboard: true, UI: true }}
				start={{ horizontal: 0, vertical: 0, zoom: 0 }}
				//current={{ horizontal: H, vertical: V, zoom: Z }}
				zoomMax={200}
				onChangeH={setH}
				onChangeV={setV}
				onChangeZ={setZ}
			>
				{out && (
					<>
						<Plan draw={out.cube["02"]} size={size} position="front" />
						<Plan draw={out.cube["10"]} size={size} position="top" />
						<Plan draw={out.cube["11"]} size={size} position="left" />
						<Plan draw={out.cube["12"]} size={size} position="bottom" />
						<Plan draw={out.cube["22"]} size={size} position="back" />
						<Plan draw={out.cube["23"]} size={size} position="right" />
					</>
				)}
			</D3Element>
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
