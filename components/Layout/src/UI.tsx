import styled, { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle<{
	isMobile: boolean
}>`
  body, html, #__next {
	height: 100%;
	width: 100%;
	margin: 0;
	font-family: monospace;

	/* la taille de base se transmet par heritage. La poser sur * la
	   rejouait sur chaque element, ce qui ecrasait les tailles locales :
	   celle du terminal et celle de l'art ascii ne servaient a rien. */
    font-size: ${({ isMobile }) => (isMobile ? "10px" : "17px")};
  }

  * {
	-webkit-tap-highlight-color: transparent;
  }

  /* les controles de formulaire n'heritent pas de la police par defaut */
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
