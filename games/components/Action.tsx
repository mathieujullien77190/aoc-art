/** @format */

import React from "react"
import styled from "styled-components"

import { colors } from "_components/constants"

const ActionContainer = styled.button`
	background-color: transparent;
	color: ${colors.textColor};
	font-weight: bold;

	padding: 0;
	margin: 0 2px;
	cursor: pointer;
	font-family: monospace;
	border: none;
	height: 25px;
	min-width: 30px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	outline: none;

	> span {
		padding: 0px 2px;
	}

	&:hover {
		> span {
			color: ${colors.background};
			background-color: ${colors.importantColor};
		}
	}
`

type ActionProps = {
	value: string
	onClick?: () => void
}

export const Action = ({ value, onClick = () => {} }: ActionProps) => {
	return (
		<>
			<ActionContainer onClick={onClick}>
				[<span>{value}</span>]
			</ActionContainer>
		</>
	)
}
