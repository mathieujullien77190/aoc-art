import styled from "styled-components"

/**
 * Glued to the right edge of the screen, behind everything: the icons, the
 * windows and the task bar paint over it (it is mounted before them).
 */
export const Wrapper = styled.a`
	position: fixed;
	top: 24%;
	right: 0;
	width: 46px;
	z-index: 0;
	cursor: pointer;

	svg {
		display: block;
		width: 100%;
		height: auto;
	}
`
