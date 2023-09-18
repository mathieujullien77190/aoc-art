/** @format */

import styled from "styled-components"
import { colors } from "_components/constants"

export const Close = styled.div`
	position: fixed;
	z-index: 11;
	font-size: 24px;
	cursor: pointer;
	display: flex;
	width: 32px;
	height: 32px;
	background: black;
	justify-content: center;
	align-items: center;
	transition: all 0.3s ease-in;
`

export const Container = styled.div`
	position: fixed;
	padding: 8px;
	top: 10px;
	left: 10px;
	z-index: 1100;
	display: flex;
	background: black;

	a {
		color: ${colors.textColor};
		text-decoration: none;

		span {
			color: ${colors.textColor};
			text-decoration: underline;
		}
	}
`
