import styled from "styled-components"

/** recouvre la video : l'image est redessinee ici, avec les cadres par-dessus */
export const Canvas = styled.canvas`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	background-color: #000;
`
