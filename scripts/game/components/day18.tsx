/** @format */

import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { isMobile } from "react-device-detect"

import { colors } from "_components/constants"

import { data, getAllPlan, volcano, searchInsideCube } from "../core/day18"

import { D3Element } from "./D3Element"
import { Slider } from "./Slider"

const Wrapper = styled.div`
	overflow: hidden;
	height: 100%;
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
	width: ${data.limits.xMax * 10}px;
	height: ${data.limits.yMax * 15}px;

	border: ${({ highlight }) => (highlight ? "solid 1px white" : "none")};

	transform: ${({ size, z }) =>
		`rotateX(90deg) translateZ(${-z * 10 + size / 4}px)`};

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

const zoomMax = 500

const Animation = () => {
	const [color, setColor] = useState<number>(9)
	const [basePlan, setBasePlan] = useState<string[]>([])

	const handleClick = useCallback(e => {
		e.preventDefault()
		setColor(prev => (prev + 1 > 19 ? -1 : prev + 1))
	}, [])

	useEffect(() => {
		const test = searchInsideCube(data)

		setBasePlan(getAllPlan(data.base, test.inside, test.outside, data.limits))
	}, [])

	return (
		<Wrapper onContextMenu={handleClick}>
			<D3Element
				size={400}
				margin={-100}
				control={{ mouse: true, keyboard: true, UI: true }}
				start={{ horizontal: 330, vertical: 140, zoom: 0 }}
				zoomMax={zoomMax}
				addControl={
					<Slider
						width={isMobile ? "auto" : "280px"}
						label="Mettre en évidence"
						min={-1}
						max={data.limits.zMax - 1}
						step={1}
						unit=""
						value={color}
						onChange={setColor}
					/>
				}
			>
				<>
					{basePlan.map((draw, i) => (
						<Plan
							draw={draw}
							size={400}
							z={i}
							key={i}
							highlight={color === i ? true : color === -1 ? null : false}
						/>
					))}
				</>
			</D3Element>

			<Volcano dangerouslySetInnerHTML={{ __html: volcano }} />
		</Wrapper>
	)
}

export default Animation
