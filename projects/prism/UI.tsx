/** @format */

import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.div`
	height: 100%;
	display: flex;
	gap: 16px;
	padding: 12px;
	box-sizing: border-box;
	color: ${colors.textColor};

	/* en fenetre etroite le paramétrage passe sous la camera */
	@media (max-width: 700px) {
		flex-direction: column;
	}
`

/** colonne de gauche : les cameras, moitie de la largeur */
export const Cameras = styled.div`
	flex: 1 1 0;
	min-width: 0;
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	align-content: flex-start;
`

/** colonne de droite : les reglages, l'autre moitie */
export const Settings = styled.div`
	flex: 1 1 0;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
`

export const SettingsTitle = styled.div`
	font-size: 12px;
	letter-spacing: 1px;
	color: ${colors.importantColor};
	border-bottom: solid 1px ${colors.infoColor};
	padding-bottom: 4px;
`

/** consigne d'usage de la pipette */
export const Hint = styled.div`
	font-size: 11px;
	font-style: italic;
	color: ${colors.textColor};
	opacity: 0.7;
`

/** couleur actuellement selectionnee, avec sa valeur */
export const Swatch = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: ${colors.textColor};

	&::before {
		content: "";
		width: 20px;
		height: 20px;
		flex: 0 0 auto;
		background-color: ${({ $color }) => $color};
		border: solid 1px ${colors.infoColor};
	}
`
