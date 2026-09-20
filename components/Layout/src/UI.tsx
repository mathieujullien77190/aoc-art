import styled, { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle<{
	isMobile: boolean
}>`
  body, html {
	height: 100%;
	width: 100%;
	margin: 0;
	font-family: monospace;

	/* the base size is passed down by inheritance. Setting it on * replayed
	   it on every element, overriding local sizes: the terminal's and the
	   ascii art's were useless. */
    font-size: ${({ isMobile }) => (isMobile ? "10px" : "17px")};
  }

  * {
	-webkit-tap-highlight-color: transparent;
  }

  /* form controls do not inherit the font by default */
  input, button, textarea, select {
	font: inherit;
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
