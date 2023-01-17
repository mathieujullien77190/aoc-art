/** @format */

import { useState } from "react"
import styled from "styled-components"
import { isMobile } from "react-device-detect"

import { organize, goN, map, actions, draw } from "_games/core/day22"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"
import { AnimationValue } from "_games/components/Controls"

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
	const [reload, setReload] = useState<number>(0)
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<{ cube: Record<string, string>; meta: any }>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				const cube = organize(draw)
				return goN(cube, map, actions, { x: 0, y: 0 }, "01")
			}, true),
		control: { pause, reload, speed },
	})

	return (
		<WrapperContainer3D>
			<D3
				size={{ width: size, height: size }}
				margin={-100}
				zoom={{ value: isMobile ? 2 : 3, min: 1, max: 20, step: 1, bigStep: 2 }}
				start={{ H: 30, V: 320 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				addControl={[
					{
						name: "animation",
						speed,
						pause,
						reload,
					},
				]}
				onControlChange={(name: string, value) => {
					if (name === "animation") {
						setSpeed((value as AnimationValue).speed)
						setReload((value as AnimationValue).reload)
						setPause((value as AnimationValue).pause)
					}
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
			<Stats stats={stats} />
		</WrapperContainer3D>
	)
}

export default Animation
