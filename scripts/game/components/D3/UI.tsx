/** @format */

import styled from "styled-components"

export const Wrapper = styled.div<{ mouseControl: boolean }>`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	overflow: hidden;
	user-select: none;

	cursor: ${({ mouseControl }) => (mouseControl ? "move" : "default")};
`

export const Container = styled.div<{ size: number; margin: number }>`
	margin-top: ${({ margin }) => `${margin}px`};
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};
	perspective: ${({ size }) => `${size * 2}px`};
`

export const Cube = styled.div<{
	size: number
}>`
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};

	transform-style: preserve-3d;
	margin-top: -50px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const Control = styled.div`
	position: absolute;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: start;
	z-index: 10;

	p {
		padding: 5px;
		background: black;
		line-height: 25px;
	}
`

export const Line = styled.div`
	padding: 5px;
	background: black;
	line-height: 25px;

	label {
		display: inline-block;
		width: 280px;
	}
`
