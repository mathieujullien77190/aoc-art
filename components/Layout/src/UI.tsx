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
	font-family: monospace;
  }

  *, input {
	-webkit-tap-highlight-color: transparent;
    font-size: ${({ isMobile }) => (isMobile ? "10px" : "17px")};
  }
`

export const App = styled.div`
	width: 100%;
    height: 100%;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;

`
