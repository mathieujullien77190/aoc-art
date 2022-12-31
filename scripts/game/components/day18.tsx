/** @format */

import { useState, useEffect, useCallback } from "react"
import styled, { css } from "styled-components"
import { colors } from "_components/constants"

import { data, getAllPlan, max, volcano, searchInsideCube } from "../core/day18"
import { Slider } from "./Slider"

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	overflow: hidden;
`

const Volcano = styled.pre`
	position: absolute;
	bottom: 10px;
	right: 10px;

	margin: 0;

	span {
		opacity: 0.4;
	}

	span.text {
		opacity: 1;
	}

	span.target {
		opacity: 1;
		color: ${colors.importantColor};
	}
`

const Control = styled.div`
	position: absolute;
	bottom: 10px;
	left: 10px;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: start;
	z-index: 10;

	p {
		padding: 5px;
		background: black;
	}
`

const Container = styled.div<{ size: number; X: number; Y: number; Z: number }>`
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};
	perspective: ${({ size }) => `${size * 2}px`};

	.cube {
		margin-top: -50px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: ${({ size }) => `${size}px`};
		height: ${({ size }) => `${size}px`};
		position: relative;
		transform-style: preserve-3d;
		transform: ${({ size }) => `translateZ(-${size / 2}px)`};
		transition: transform 1s;
		transform: ${({ X, Y, Z }) =>
			`translateZ(${100 + Z}px) rotateX(${X}deg) rotateY(${Y}deg)`};
	}
`

const PlanContainer = styled.div<{
	size: number
	z: number
	highlight: boolean
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 15px;
	line-height: 15px;
	position: absolute;
	width: ${max.x * 10}px;
	height: ${max.y * 16}px;

	border-top: ${({ highlight }) => (highlight ? "solid 1px white" : "none")};
	border-left: ${({ highlight }) => (highlight ? "solid 1px white" : "none")};

	${({ highlight }) =>
		highlight &&
		css`
			&:after {
				position: absolute;
				content: "Y";
				width: 20px;
				height: 20px;
				top: 0;
				left: -30px;
				transform: rotateZ(180deg);
			}

			&:before {
				position: absolute;
				content: "X";
				width: 20px;
				height: 20px;
				top: -20px;
				left: 0px;
				transform: rotateZ(90deg);
			}
		`}

	transform: ${({ size, z }) =>
		`rotateX(90deg) translateZ(${-size / 4 + z * 10}px)`};

	pre {
		margin: 0;
		opacity: ${({ highlight }) =>
			highlight ? 1 : highlight === false ? 0.1 : 1};
		color: ${({ highlight }) =>
			highlight ? colors.importantColor : colors.textColor};

		span.in {
			color: ${colors.infoColor};
		}

		span.out {
			color: ${colors.restrictedColor};
		}
	}
`

type PlanProps = {
	draw: string
	size: number
	z: number
	highlight: boolean | null
}

const Plan = ({ draw, size, z, highlight }: PlanProps) => {
	const formatDraw = draw
		.replace(/(x+)/g, '<span class="in">$1</span>')
		.replace(/(\.+)/g, '<span class="out">$1</span>')

	return (
		<PlanContainer size={size} z={z} highlight={highlight}>
			<pre dangerouslySetInnerHTML={{ __html: formatDraw }}></pre>
		</PlanContainer>
	)
}

const Animation = () => {
	const [H, setH] = useState<number>(110)
	const [V, setV] = useState<number>(140)
	const [Z, setZ] = useState<number>(100)
	const [plan, setPlan] = useState<number>(max.z)
	const [color, setColor] = useState<number>(7)
	const [basePlan, setBasePlan] = useState<string[]>([])

	const control = useCallback((e: KeyboardEvent) => {
		if (e.code === "ArrowUp") setV(prev => (prev + 10 > 360 ? 360 : prev + 10))
		if (e.code === "ArrowDown") setV(prev => (prev - 10 < 0 ? 0 : prev - 10))
		if (e.code === "ArrowRight")
			setH(prev => (prev + 10 > 360 ? 360 : prev + 10))
		if (e.code === "ArrowLeft") setH(prev => (prev - 10 < 0 ? 0 : prev - 10))
		if (e.code === "Enter") setZ(prev => (prev + 10 > 250 ? 250 : prev + 10))
		if (e.code === "Backspace")
			setZ(prev => (prev - 10 < 100 ? 100 : prev - 10))
	}, [])

	useEffect(() => {
		document.body.addEventListener("keydown", control)
		document.body.focus()

		const test = searchInsideCube(data, max)

		setBasePlan(getAllPlan(data, test.inside, test.notInside))

		return () => {
			document.body.removeEventListener("keydown", control)
		}
	}, [])

	return (
		<Wrapper
			onClick={e => {
				e.stopPropagation()
			}}
		>
			<Container size={400} X={V} Y={H} Z={Z}>
				<div className="cube">
					{basePlan
						.filter((_, i) => i <= plan)
						.map((draw, i) => (
							<Plan
								draw={draw}
								size={400}
								z={i}
								key={i}
								highlight={color === i ? true : color === -1 ? null : false}
							/>
						))}
				</div>
			</Container>
			<Control>
				<p>Contrôle clavier : [→] [←] [↑] [↓] [Enter] [Backspace]</p>
				<Slider
					label="Zoom               "
					min={100}
					max={250}
					step={10}
					bigStep={50}
					unit="%"
					value={Z}
					onChange={setZ}
				/>
				<Slider
					label="Rotation horyzontal"
					min={0}
					max={360}
					step={10}
					bigStep={90}
					unit="°"
					value={H}
					onChange={setH}
				/>
				<Slider
					label="Rotation vertical  "
					min={0}
					max={360}
					step={10}
					bigStep={90}
					unit="°"
					value={V}
					onChange={setV}
				/>
				<Slider
					label="Afficher plan        "
					min={0}
					max={max.z}
					step={1}
					unit=""
					value={plan}
					onChange={setPlan}
				/>
				<Slider
					label="Mettre en évidence   "
					min={-1}
					max={max.z - 1}
					step={1}
					unit=""
					value={color}
					onChange={setColor}
				/>
			</Control>
			<Volcano dangerouslySetInnerHTML={{ __html: volcano }} />
		</Wrapper>
	)
}

export default Animation
