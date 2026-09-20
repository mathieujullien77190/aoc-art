import styled, { keyframes } from "styled-components"

const blink = keyframes`
	50% {
		opacity: 0;
	}
`

/** hors de la page d'accueil, GlobalStyles n'est pas monte : tout est pose ici */
export const Screen = styled.div`
	position: fixed;
	inset: 0;
	box-sizing: border-box;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	background: #0200a7;
	color: white;
	font-family: monospace;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;

	h3 {
		margin: 0 0 1em;
		background-color: lightgray;
		padding: 0 4px;
		color: #0200a7;
	}

	p {
		margin: 0 0 1em;
		max-width: 60ch;
	}
`

export const Cursor = styled.span`
	animation: ${blink} 1s steps(1) infinite;
`
