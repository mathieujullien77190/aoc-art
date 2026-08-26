import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.label`
	display: flex;
	flex-direction: column;
	gap: 6px;
	color: ${colors.textColor};
`

export const Head = styled.span`
	display: flex;
	justify-content: space-between;
	gap: 8px;
	font-size: 12px;
	letter-spacing: 1px;
	color: ${colors.infoColor};
`

export const Value = styled.span`
	color: ${colors.importantColor};
`

export const Range = styled.input`
	width: 100%;
	min-width: 0;
	margin: 0;
	cursor: pointer;
	accent-color: ${colors.importantColor};

	&:disabled {
		cursor: default;
		opacity: 0.4;
	}
`
