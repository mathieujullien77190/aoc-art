/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.div`
	position: fixed;
	padding: 0;
	top: 24px;
	right: 24px;
	bottom: 24px;
	left: 24px;
	z-index: 10;
	background: ${colors.overlay};
	border: solid 2px ${colors.textColor};
	overflow: hidden;

	@media screen and (max-width: 1024px) {
		top: 12px;
		right: 12px;
		bottom: 12px;
		left: 12px;
		padding: 0;
	}
`
