/** @format */

import styled, { createGlobalStyle } from "styled-components"
import { colors } from "_components/constants"

export const GlobalStyles = createGlobalStyle<{
	isMobile: boolean
}>`
  body, html, #__next {
	height: 100%;
	width: 100%;
	margin: 0;
	background: ${colors.background};
  }

  *, input {
    font-size: ${({ isMobile }) => (isMobile ? "10px" : "17px")};
  }
`

export const App = styled.div`
	padding: 12px;
	min-height: calc(100% - 24px);
	display: flex;
`
