import styled from "styled-components"
import { Mode, Pos } from "./types"
import { colors } from "../constants"
import {
	FULL,
	ANIM_TIME,
	CASCADE,
	MEDIUM_MARGIN,
	MEDIUM_SIZE,
	PHONE_HEIGHT,
	PHONE_WIDTH,
	TOP_LAYER,
	WINDOW_COLORS,
	WINDOW_FONT,
} from "./constants"

type ContainerProps = {
	$mode: Mode
	$rank: number
	$drag: Pos
	$followMouse: boolean
	$layer: number
	/** height reserved at the bottom, in CSS: the desktop puts its taskbar there */
	$bottomInset: string
	/** fixed portrait template instead of the medium square, see WindowProps.phone */
	$phone: boolean
}

/**
 * Window position, in percent: no desktop measurement needed, and it
 * follows resizing. The cascade and mouse offset are added in pixels.
 *
 * It goes in inline style, not CSS: styled-components makes one class per
 * interpolated value, and a drag would produce one per pixel travelled.
 *
 * The offset uses top/left, not a transform: a transformed ancestor becomes
 * the reference for the position: fixed it contains, which shifted stux's
 * full-screen canvas.
 */
const place = ({ $mode, $rank, $drag }: ContainerProps) => {
	if ($mode === "full") return { top: 0, left: 0 }
	if ($mode === "close") return { top: "50%", left: "50%" }

	const shift = $rank * CASCADE

	return {
		top: `calc(${MEDIUM_MARGIN}% + ${shift + $drag.y}px)`,
		left: `calc(${MEDIUM_MARGIN}% + ${shift + $drag.x}px)`,
	}
}

export const Container = styled.div.attrs<ContainerProps>(props => ({
	style: place(props),
}))`
	position: absolute;

	${({ $mode, $bottomInset, $phone }) => {
		if ($mode === "close") return "width: 0; height: 0;"

		if ($mode !== "full" && $phone)
			return `
				width: calc(${PHONE_WIDTH} - ${FULL.borderSize} * 2);
				height: calc(${PHONE_HEIGHT} - ${FULL.borderSize} * 2);
			`

		const side = $mode === "full" ? 100 : MEDIUM_SIZE
		return `
			width: calc(${side}% - ${FULL.borderSize} * 2);
			height: calc(${side}% - ${$bottomInset} - ${FULL.borderSize} * 2);
		`
	}}


	border-style: solid;
	border-width: ${FULL.borderSize};
	border-color: ${WINDOW_COLORS.border};
	font-family: ${WINDOW_FONT};
	background-color: ${WINDOW_COLORS.content};
	color: ${WINDOW_COLORS.text};
	overflow: hidden;
	font-weight: ${FULL.fontWeight};
	z-index: ${({ $layer }) => $layer || TOP_LAYER};

	/* while dragging, a transition would let go of the cursor: only width and
	   height stay animated */
	transition: ${({ $followMouse }) =>
		$followMouse
			? `width ${ANIM_TIME / 1000}s ease-out, height ${
					ANIM_TIME / 1000
				}s ease-out`
			: `all ${ANIM_TIME / 1000}s ease-out`};

	${({ $mode }) => {
		if ($mode === "medium")
			return `
				box-shadow: 3px 2px 4px #00000041;
				border-radius: 4px;
			`
	}}
`

export const topBar = styled.div`
	height: 15px;
	background-color: ${WINDOW_COLORS.titleBar};
	border-bottom-style: solid;
	border-bottom-width: ${FULL.borderSize};
	border-bottom-color: ${WINDOW_COLORS.border};
	display: flex;
	align-items: center;
	padding: ${FULL.padding};
	cursor: move;
`

/**
 * The area under the title bar. The 25px removed are the bar itself: 15
 * high, its two paddings and its bottom border.
 *
 * With `$flush`, no margin or background: the content handles both and
 * goes from border to border.
 */
export const Content = styled.div<{ $flush: boolean }>`
	overflow-y: auto;
	height: ${({ $flush }) =>
		$flush ? "calc(100% - 25px)" : `calc(100% - ${FULL.padding} * 2 - 25px)`};
	padding: ${({ $flush }) => ($flush ? "0" : FULL.padding)};
	background-color: ${({ $flush }) =>
		$flush ? "transparent" : colors.background};

	&::-webkit-scrollbar {
		-webkit-appearance: none;
		width: 12px;
		background-color: #f2e7c8;
		border-radius: 2px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #776b6d;
		border-radius: 2px;
		border-top: solid 1px black;
		border-bottom: solid 1px black;
	}
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
