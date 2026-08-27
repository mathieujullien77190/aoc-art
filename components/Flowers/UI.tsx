import styled from "styled-components"

/**
 * Le calque d'une plante, au-dessus de tout, pose sur le bas de l'ecran.
 * La taille et le decalage horizontal sont mis en style inline par le
 * hook : la bibliotheque lit la taille la, pas dans la feuille de style.
 */
export const Container = styled.div`
	position: fixed;
	bottom: 0;
	z-index: 30000;
	pointer-events: none;
`
