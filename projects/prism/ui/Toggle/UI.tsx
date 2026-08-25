/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`

export const Text = styled.span`
	font-size: 12px;
	letter-spacing: 1px;
	color: ${colors.infoColor};
`

export const Buttons = styled.div`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
`

export const Button = styled.button<{ $active: boolean }>`
	cursor: pointer;
	padding: 4px 10px;
	font-family: inherit;
	font-size: 12px;
	background-color: transparent;
	border: solid 1px
		${({ $active }) => ($active ? colors.importantColor : colors.infoColor)};
	color: ${({ $active }) =>
		$active ? colors.importantColor : colors.textColor};

	&:hover {
		border-color: ${colors.importantColor};
	}
`
