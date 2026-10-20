import styled from "styled-components"

/**
 * The whole screen, behind everything: the icons, the windows and the task bar
 * paint over it. The empty desktop lets pointer events through to it.
 */
export const Canvas = styled.canvas`
	position: fixed;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	display: block;
`
