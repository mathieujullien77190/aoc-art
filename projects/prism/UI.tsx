/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

/** empile les cameras ; la fenetre etant fixe, le contenu defile */
export const Container = styled.div`
	height: 100%;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 12px;
	box-sizing: border-box;
	color: ${colors.textColor};
`
