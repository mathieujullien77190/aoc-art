import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: ${colors.textColor};
`

/** entete pleine largeur : aligne le haut de la video et des reglages */
export const Title = styled.div`
	font-size: 12px;
	letter-spacing: 1px;
	color: ${colors.infoColor};
`

export const Status = styled.span<{ $on: boolean }>`
	color: ${({ $on }) => ($on ? colors.appColor : colors.restrictedColor)};
`

export const Body = styled.div`
	display: flex;
	gap: 16px;

	/* en fenetre etroite les reglages passent sous la camera */
	@media (max-width: 700px) {
		flex-direction: column;
	}
`

export const Viewer = styled.div`
	flex: 1 1 0;
	min-width: 0;
	display: flex;
`

export const Settings = styled.div`
	flex: 1 1 0;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
`

export const Hint = styled.div`
	font-size: 11px;
	font-style: italic;
	color: ${colors.textColor};
	opacity: 0.7;
`

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
