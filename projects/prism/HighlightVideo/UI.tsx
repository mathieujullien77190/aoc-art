import styled from "styled-components"

/** recouvre la video : le canvas remplace l'image, il ne s'y superpose pas */
export const Canvas = styled.canvas`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	background-color: #000;
	cursor: crosshair;
`
