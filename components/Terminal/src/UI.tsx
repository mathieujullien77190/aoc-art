import styled from "styled-components"
import { colors } from "_components/constants"

export const TerminalContainer = styled.div`
	background: ${colors.background};
	color: ${colors.textColor};
	font-family: monospace;
	width: 100%;
	height: 100%;
	font-size: 14px;

	/* referentiel des unites cqw : l'art ascii se dimensionne sur la
	   fenetre de l'OS et non sur celle du navigateur */
	container-type: inline-size;
`
