import styled from "styled-components"
import { Size, Mode } from "./types"
import { colors } from "_components/constants"
import { COLORS, FULL, ANIM_TIME } from "./constants"
import { FULL as FULLWindows } from "../Windows/constants"

export const Container = styled.div<{
	$size: Size
	$mode: Mode
	$followMouse: boolean
}>`
	position: absolute;
	width: ${({ $size }) =>
		`calc(${$size.width}${$size.unit} - ${FULL.borderSize} * 2)`};
	height: ${({ $size }) =>
		`calc(${$size.height}${$size.unit} - ${FULLWindows.heightBar} - ${FULLWindows.borderSize} * 2)`};

	border-style: solid;
	border-width: ${FULL.borderSize};
	border-color: ${COLORS.borderColor};
	background-color: ${COLORS.backgroundContent};
	color: ${COLORS.text};
	overflow: hidden;
	font-weight: ${FULL.fontWeight};
	z-index: 9;

	transition: ${({ $followMouse }) =>
		$followMouse
			? `width ${ANIM_TIME / 1000}s ease-out, height ${
					ANIM_TIME / 1000
			  }s ease-out`
			: `all ${ANIM_TIME / 1000}s ease-out`};

	${({ mode }) => {
		if (mode === "medium")
			return `
      box-shadow: 3px 2px 4px #00000041;
      border-radius: 4px;
    `
	}}
`

export const topBar = styled.div`
	height: 15px;
	background-color: ${COLORS.backgroundTitle};
	border-bottom-style: solid;
	border-bottom-width: ${FULL.borderSize};
	border-bottom-color: ${COLORS.borderColor};
	display: flex;
	align-items: center;
	padding: ${FULL.padding};
	cursor: move;
`

export const Content = styled.div`
	overflow-y: scroll;
	height: ${`calc(100% - ${FULL.padding} * 2 - 25px)`};
	padding: ${FULL.padding};
	background-color: ${colors.background};
`

export const Title = styled.div`
	width: 100%;
	font-weight: bold;
	display: flex;
	justify-content: start;
	align-items: center;
`

export const Actions = styled.div`
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
	span {
		cursor: pointer;
		font-size: 14px;
		margin-top: -1px;
		font-weight: bold;
		padding: 0 6px;
	}
`

export const Wrapper = styled.div<{ $ready: boolean; $mode: Mode }>`
	width: 100%;
	height: 100%;
	opacity: ${({ $ready }) => ($ready ? 1 : 0)};

	${({ $mode }) =>
		$mode !== "close" &&
		`
    transition: all ${ANIM_TIME / 1000}s ease-out;
  `};
`
