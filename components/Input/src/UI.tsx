/** @format */

import styled from "styled-components"
import { colors } from "_components/constants"

export const CustomInput = styled.input<{ nbsLetters: number }>`
	background-color: ${colors.background};
	border: none;
	outline: none;
	color: white;
	padding: 0;
	margin: 0;
	font-family: monospace;
	width: ${({ nbsLetters }) => nbsLetters * 10 + 10}px;
	margin-left: 8px;
`

export const Container = styled.div`
	display: flex;
`

export const Predict = styled.span`
	opacity: 0.5;
`

export const Lambda = styled.strong``
