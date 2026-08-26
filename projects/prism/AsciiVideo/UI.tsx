import styled from "styled-components"

import { colors } from "_components/constants"

/**
 * Recouvre la video : l'ascii remplace l'image, il ne s'y superpose pas.
 * La police est calculee pour que $cols caracteres tiennent exactement dans
 * la largeur du cadre — un glyphe monospace fait ~0.6em de large.
 */
export const Ascii = styled.pre<{ $cols: number }>`
	position: absolute;
	inset: 0;
	margin: 0;
	background-color: #000;
	color: ${colors.textColor};
	font-family: monospace;
	font-size: ${({ $cols }) => `calc(100cqw / ${$cols} / 0.6)`};
	line-height: 1;
	white-space: pre;
	overflow: hidden;
	user-select: none;
`
