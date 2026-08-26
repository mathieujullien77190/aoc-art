import styled from "styled-components"

import { COLORS, FULL } from "./constants"
import { Pos } from "./types"

export const Container = styled.div<{ $pos?: Pos }>`
	position: absolute;

	/* sans position donnee, la boite se pose au milieu du bureau */
	${({ $pos }) =>
		$pos
			? `top: ${$pos.y}px; left: ${$pos.x}px;`
			: "top: 50%; left: 50%; transform: translate(-50%, -50%);"}

	border-style: solid;
	border-width: ${FULL.borderSize};
	border-color: ${COLORS.borderColor};
	width: ${FULL.width}px;
	max-width: 90%;
	border-radius: 4px;
	box-shadow: 3px 2px 4px #00000041;
	background-color: ${COLORS.backgroundContent};
	color: ${COLORS.text};
	font-weight: ${FULL.fontWeight};
	z-index: 10;
`

export const topBar = styled.div`
	height: 15px;
	background-color: ${COLORS.backgroundTitle};
	border-bottom-style: solid;
	border-bottom-width: ${FULL.borderSize};
	border-bottom-color: ${COLORS.borderColor};
	display: flex;
	justify-content: end;
	align-items: center;
	padding: ${FULL.padding};
	border-radius: 2px 2px 0 0;

	span {
		cursor: pointer;
		font-size: 12px;
		margin-top: -1px;
	}
`

export const Message = styled.div`
	padding: 14px 12px;
	text-align: center;
	line-height: 1.4;
`

export const Buttons = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	gap: 6px;
	padding: 0 8px 12px;
`

export const Button = styled.div<{ $fleeing?: boolean }>`
	border-style: solid;
	border-width: ${FULL.borderSize};
	border-color: ${COLORS.borderColor};
	padding: 4px 8px;
	text-align: center;
	cursor: pointer;
	color: ${COLORS.text};
	background-color: ${COLORS.button};
	border-radius: 4px;
	transition: transform 0.4s ease-in-out;

	/* en fuite : il quitte la boite, il doit passer au-dessus du reste */
	${({ $fleeing }) => $fleeing && "position: relative; z-index: 11;"}

	&:hover {
		background-color: ${COLORS.buttonOver};
	}
`
