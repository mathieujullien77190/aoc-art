/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.label`
	display: flex;
	flex-direction: column;
	gap: 6px;
	color: ${colors.textColor};
`

export const Text = styled.span`
	font-size: 12px;
	letter-spacing: 1px;
	color: ${colors.infoColor};
`

export const Input = styled.input`
	width: 100%;
	min-width: 0;
	box-sizing: border-box;
	padding: 4px 6px;
	font-family: inherit;
	font-size: 12px;
	color: ${colors.textColor};
	background-color: transparent;
	border: solid 1px ${colors.infoColor};
	outline: none;

	&:focus {
		border-color: ${colors.importantColor};
	}

	&[type="color"] {
		height: 28px;
		padding: 2px;
		cursor: pointer;
	}
`
