import styled from "styled-components"

export const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const Computer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
`

export const Desktop = styled.div<{
	$power: boolean
	$fatalError: boolean
	$ready: boolean
	$bios: boolean
	$oldScreen: boolean
}>`
	width: 100%;
	height: 100%;
	color: white;
	font-size: 14px;
	overflow: hidden;

	background: ${({ $power, $fatalError, $ready, $bios }) => {
		if ($power) {
			if ($fatalError || $bios) return "#0200A7"
			if ($ready) {
				return "#84787A"
			} else {
				return "#2a2a2a"
			}
		}

		return "#000000"
	}};

	@keyframes flicker {
		0% {
			opacity: 0.27861;
		}
		5% {
			opacity: 0.34769;
		}
		10% {
			opacity: 0.23604;
		}
		15% {
			opacity: 0.90626;
		}
		20% {
			opacity: 0.18128;
		}
		25% {
			opacity: 0.83891;
		}
		30% {
			opacity: 0.65583;
		}
		35% {
			opacity: 0.67807;
		}
		40% {
			opacity: 0.26559;
		}
		45% {
			opacity: 0.84693;
		}
		50% {
			opacity: 0.96019;
		}
		55% {
			opacity: 0.08594;
		}
		60% {
			opacity: 0.20313;
		}
		65% {
			opacity: 0.71988;
		}
		70% {
			opacity: 0.53455;
		}
		75% {
			opacity: 0.37288;
		}
		80% {
			opacity: 0.71428;
		}
		85% {
			opacity: 0.70419;
		}
		90% {
			opacity: 0.7003;
		}
		95% {
			opacity: 0.36108;
		}
		100% {
			opacity: 0.24387;
		}
	}

	&::before {
		${({ $ready, $oldScreen }) =>
			$ready &&
			$oldScreen &&
			`
      content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(18, 16, 16, 0.1);
    opacity: 0;
    z-index: 2;
    pointer-events: none;
    animation: flicker 0.15s infinite;
  `}
	}
`

export const FatalError = styled.div`
	height: calc(100% - 20px);
	font-weight: bold;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 10px;

	h3 {
		background-color: lightgray;
		padding: 0 4px;
		color: #0200a7;
	}
`
