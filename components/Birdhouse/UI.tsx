import styled from "styled-components"

/**
 * Glued to the right edge of the screen, over everything. A link: it is
 * small enough to stay out of the way of the shell and the windows.
 */
export const Wrapper = styled.a`
	position: fixed;
	top: 24%;
	right: 0;
	width: 46px;
	z-index: 30000;
	cursor: pointer;

	svg {
		display: block;
		width: 100%;
		height: auto;
	}
`
