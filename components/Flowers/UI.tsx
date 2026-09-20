import styled from "styled-components"

/**
 * A plant layer, over everything, at the bottom of the screen. Size and
 * horizontal offset go in inline style: the library reads the size there.
 */
export const Container = styled.div`
	position: fixed;
	bottom: 0;
	z-index: 30000;
	pointer-events: none;
`
