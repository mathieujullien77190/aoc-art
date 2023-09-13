/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.div`
	position: fixed;
	padding: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 10;
	background: ${colors.overlay};
	overflow: hidden;
`
