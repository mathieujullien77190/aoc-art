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

export const Button = styled.button`
	align-self: flex-start;
	cursor: pointer;
	padding: 4px 10px;
	font-family: inherit;
	font-size: 12px;
	background-color: transparent;
	border: solid 1px ${colors.infoColor};
	color: ${colors.textColor};

	&:hover:not(:disabled) {
		border-color: ${colors.importantColor};
	}

	&:disabled {
		cursor: default;
		opacity: 0.4;
	}
`
