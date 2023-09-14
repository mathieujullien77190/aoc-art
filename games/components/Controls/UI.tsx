import styled from "styled-components"

export const ControllerContainer = styled.div<{
	$show: boolean
	$bottom: number
}>`
	transition: all 0.1s ease-in;
	position: absolute;
	left: 0;
	right: 0;
	bottom: ${({ $bottom, $show }) => ($show ? 0 : `${$bottom}px`)};
	background-color: ${({ $show }) => ($show ? `#00000030` : "black")};

	z-index: 10;
	padding: 12px;

	@media screen and (min-width: 1024px) {
		&:hover {
			background-color: black;
			bottom: 0;
		}
	}
`

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: start;
`

export const Title = styled.p`
	text-align: center;
	width: 100%;
	cursor: pointer;
	margin: 0;
	padding: 0 0 10px 0;
`

export const Line = styled.div`
	padding: 5px;
	line-height: 25px;
	display: inline-flex;
	width: 100%;

	> span {
		margin-left: auto;
	}
`

export const HelpContainer = styled.p`
	text-align: left;
	padding: 5px;
	margin: 0;
`

export const Separator = styled.div`
	width: 100%;
	text-align: center;

	hr {
		color: white;
	}
`
