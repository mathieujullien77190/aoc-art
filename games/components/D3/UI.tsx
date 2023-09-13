import { Size } from "_games/helpers/types"
import styled from "styled-components"

export const Wrapper = styled.div<{ $mouseControl: boolean }>`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	overflow: hidden;
	user-select: none;

	cursor: ${({ $mouseControl }) => ($mouseControl ? "move" : "default")};
`

export const Container = styled.div<{ $size: Size; $margin: number }>`
	width: ${({ $size }) => ($size ? `${$size.width}px` : "auto")};
	height: ${({ $size }) => ($size ? `${$size.height}px` : "auto")};
	perspective: ${({ $size }) =>
		$size ? `${Math.max($size.width, $size.height) * 2}px` : "auto"};
	display: flex;
	justify-content: center;
	align-items: center;
`

export const Cube = styled.div<{
	$size: Size
}>`
	transform-style: preserve-3d;
	margin-top: -50px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: ${({ $size }) => ($size ? `${$size.width}px` : "auto")};
	height: ${({ $size }) => ($size ? `${$size.height}px` : "auto")};
`
