/** @format */

import styled from "styled-components"
import { colors } from "_components/constants"

export const Container = styled.div`
	position: fixed;
	padding: 8px;
	top: 6px;
	left: 36px;
	right: 36px;
	z-index: 11;
	display: flex;
	background: ${colors.overlay};
	border: solid 2px ${colors.textColor};

	@media screen and (max-width: 1024px) {
		top: 2px;
		right: 18px;
		left: 18px;
		padding: 4px;
	}

	a {
		color: ${colors.textColor};
		text-decoration: none;

		span {
			color: ${colors.textColor};
			text-decoration: underline;
		}
	}

	div {
		display: inline-block;
		margin: 0 5px;

		&.close {
			margin-left: auto;
			cursor: pointer;
			text-decoration: underline;
		}
	}
`
