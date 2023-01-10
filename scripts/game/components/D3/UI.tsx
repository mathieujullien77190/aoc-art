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
