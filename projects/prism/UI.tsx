import styled from "styled-components"

import { colors } from "_components/constants"

/** la fenetre est de taille fixe : le contenu defile s'il deborde */
export const Container = styled.div`
	height: 100%;
	overflow-y: auto;
	padding: 12px;
	box-sizing: border-box;
	color: ${colors.textColor};
`
