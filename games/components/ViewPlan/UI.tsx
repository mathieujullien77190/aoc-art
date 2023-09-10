/** @format */

import styled from "styled-components"

export const PlanContainer = styled.div<{
	translateZ: number
	color: string
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 15px;
	line-height: 15px;
	position: absolute;
	transform: ${({ translateZ }) => `translateZ(${translateZ}px)`};
	color: ${({ color }) => color};
`

export const Pre = styled.pre`
	margin: 0;
`

export const PreHighlight = styled.pre`
	margin: 0;
	span.H {
		color: red;
		font-weight: bold;
	}
`

export const MetaText = styled.div`
	width: 100%;
	height: 100%;
	transform: rotateX(90deg) rotateZ(0deg) translateZ(90px);
	display: flex;
	justify-content: center;
	align-items: end;
	position: absolute;
	span {
		background-color: black;
		padding: 10px;
		font-weight: bold;
	}
`
