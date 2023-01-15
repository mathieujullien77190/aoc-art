/** @format */

import styled from "styled-components"
import { colors } from "_components/constants"

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const Code = styled.p`
	padding: 10px;
	margin: 0;
	border: solid 2px ${colors.textColor};
	resize: vertical;
	color: ${colors.textColor};
	font-style: italic;
	display: flex;
	flex-direction: column;
`

export const Line = styled.span<{ highlight: boolean }>`
	cursor: pointer;
	background-color: ${({ highlight }) =>
		highlight ? colors.importantColor : "inherited"};
	color: ${({ highlight }) => (highlight ? "black" : "inherited")};
`

export const Result = styled.div`
	display: inline-flex;

	> :first-child {
		margin-left: 0;
	}
`

export const Pre = styled.pre<{ highlight: boolean }>`
	margin: 10px;
	border: solid 2px ${colors.textColor};
	padding: 10px;
	cursor: pointer;

	color: ${({ highlight }) => (highlight ? "black" : "inherited")};

	span {
		background-color: ${({ highlight }) => (highlight ? "white" : "inherited")};
	}
`

export const Content = styled.div<{ display: boolean }>`
	display: ${({ display }) => (display ? "block" : "none")};
`

export const Title = styled.p`
	margin: 10px 0;
	cursor: pointer;

	&:hover {
		background-color: ${colors.importantColor};
		color: black;
	}
`
