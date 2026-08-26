import styled from "styled-components"

/**
 * Se superpose au rendu. Hors trace, `pointer-events: none` laisse les clics
 * atteindre la couche en dessous — sans quoi la pipette serait inutilisable.
 */
export const Canvas = styled.canvas<{ $editing: boolean }>`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: ${({ $editing }) => ($editing ? "auto" : "none")};
	cursor: ${({ $editing }) => ($editing ? "crosshair" : "default")};
`
