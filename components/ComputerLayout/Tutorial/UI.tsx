import styled from "styled-components"
import { colors } from "_components/constants"
import { BOX_HEIGHT } from "./constants"

/**
 * La visite se pose au-dessus de tout, fenetres et modales comprises,
 * mais laisse passer les clics : une etape peut demander de taper une
 * commande, le shell doit rester utilisable.
 */
export const Overlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 20000;
	pointer-events: none;
	font-family: monospace;
`

/**
 * Le trou du projecteur. L'ombre portee sans flou fait l'assombrissement
 * du reste de l'ecran : une seule boite au lieu de quatre bandes a
 * repositionner a chaque frame.
 */
export const Hole = styled.div<{
	$top: number
	$left: number
	$width: number
	$height: number
}>`
	position: fixed;
	top: ${({ $top }) => $top}px;
	left: ${({ $left }) => $left}px;
	width: ${({ $width }) => $width}px;
	height: ${({ $height }) => $height}px;
	border: solid 2px ${colors.importantColor};
	border-radius: 3px;
	box-shadow: 0 0 0 100vmax ${colors.overlay};
	transition: top 160ms ease, left 160ms ease, width 160ms ease,
		height 160ms ease;
`

/** cible absente ou hors ecran : on assombrit sans rien designer */
export const Veil = styled.div`
	position: fixed;
	inset: 0;
	background: ${colors.overlay};
`

export const Box = styled.div<{ $top: number; $left: number; $width: number }>`
	position: fixed;
	top: ${({ $top }) => $top}px;
	left: ${({ $left }) => $left}px;
	width: ${({ $width }) => $width}px;
	max-height: ${BOX_HEIGHT}px;
	box-sizing: border-box;
	pointer-events: auto;

	background: ${colors.background};
	color: ${colors.textColor};
	border: solid 2px ${colors.importantColor};
	border-radius: 3px;
	padding: 10px 12px;
	font-size: 14px;
	line-height: 1.4;
	transition: top 160ms ease, left 160ms ease;
`

export const Title = styled.div`
	color: ${colors.importantColor};
	font-weight: bold;
	margin-bottom: 6px;
`

export const Text = styled.div`
	margin-bottom: 10px;
`

/** un fragment de commande, rendu comme dans le shell */
export const Key = styled.span`
	background: ${colors.appColor};
	color: #000000;
	font-weight: bold;
	padding: 0 4px;
`

export const Footer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`

export const Counter = styled.div`
	color: ${colors.infoColor};
	font-size: 12px;
`

export const Actions = styled.div`
	display: flex;
	gap: 6px;
`

export const Button = styled.button`
	cursor: pointer;
	background: transparent;
	color: ${colors.importantColor};
	border: solid 1px ${colors.importantColor};
	padding: 3px 10px;

	&:hover {
		background: ${colors.importantColor};
		color: ${colors.background};
	}
`

export const Ghost = styled(Button)`
	color: ${colors.textColor};
	border-color: ${colors.textColor};

	&:hover {
		background: ${colors.textColor};
		color: ${colors.background};
	}
`
