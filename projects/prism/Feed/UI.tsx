import styled from "styled-components"

import { colors } from "_components/constants"

export const Container = styled.div`
	flex: 1 1 320px;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 6px;
`

export const Label = styled.div`
	font-size: 12px;
	letter-spacing: 1px;
	color: ${colors.infoColor};
`

export const Frame = styled.div<{ $grayscale: boolean }>`
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	/* referentiel pour dimensionner l'ascii en cqw */
	container-type: inline-size;
	border: solid 1px ${colors.infoColor};
	background-color: #000;
	overflow: hidden;

	video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		${({ $grayscale }) =>
			$grayscale ? "filter: grayscale(1) contrast(1.1);" : ""}
	}
`
