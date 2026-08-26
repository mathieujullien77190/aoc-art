/** @format */

import styled from "styled-components"

/** recouvre la page entiere, au-dessus de tout */
export const Canvas = styled.canvas`
	position: fixed;
	inset: 0;
	width: 100vw;
	height: 100vh;
	z-index: 9999;
	pointer-events: none;
`
