import styled from "styled-components"
import { colors } from "_components/constants"

export const TerminalContainer = styled.div`
	background: ${colors.background};
	color: ${colors.textColor};
	font-family: monospace;
	width: 100%;
	height: 100%;

	/* taille du shell, heritee par les commandes et la saisie */
	font-size: 16px;

	/* referentiel des unites cqw : l'art ascii se dimensionne sur la
	   fenetre de l'OS et non sur celle du navigateur */
	container-type: inline-size;

	/* Sous 700px de large, la police suit la fenetre au lieu de laisser les
	   lignes se replier : 700 / 16 = 43.75, donc 100cqw / 43.75 vaut 16px
	   pile a 700px et decroit en dessous. Pas de palier, pas de saut.
	
	   La regle vise les enfants : cqw se mesure sur le conteneur le plus
	   proche, et un element ne peut pas se mesurer sur lui-meme. */
	& > * {
		font-size: clamp(7px, calc(100cqw / 43.75), 16px);
	}
`
