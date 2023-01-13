/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

export const ContainerSlider = styled.div`
	padding: 5px;
	width: calc(100% - 10px);

	display: inline-flex;

	.highlight {
		color: ${colors.background};
		font-weight: bold;
		background-color: ${colors.importantColor};
	}
`

export const Label = styled.div``

export const Actions = styled.div`
	margin-left: auto;
`
