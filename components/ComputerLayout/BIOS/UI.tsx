import styled from "styled-components"
import { FULL, COLORS } from "./constants"

export const Container = styled.div`
	width: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
	height: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
	padding: ${FULL.padding};
	position: relative;
	cursor: none;
	font-size: ${FULL.fontSize};
`

export const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`

export const Title = styled.h2`
	margin: 0;

	padding: ${FULL.padding};
	background-color: ${COLORS.backgroundTitle};
	color: ${COLORS.title};
	display: flex;
	justify-content: center;
	align-items: center;
`

export const Content = styled.div`
	background-color: ${COLORS.backgroundContent};
	display: flex;
	flex-direction: row;
	height: 100%;
	padding: ${FULL.padding};
`

export const Left = styled.div`
	width: 60%;

	border-style: solid;
	border-width: ${FULL.borderSize};
	border-color: ${COLORS.border};

	border-right-width: ${`calc(${FULL.borderSize} / 2)`};
	padding: ${FULL.padding};

	ul {
		list-style: none;
		margin: 10px 0;
		padding: 0;
	}

	h3 {
		margin: 0;
		padding-bottom: ${FULL.padding};
		text-align: center;
		border-bottom-style: solid;
		border-bottom-width: ${FULL.borderSize};
		border-bottom-color: ${COLORS.border};
	}
`

export const Item = styled.li<{ $num?: number; $current?: number }>`
	display: flex;
	background: ${({ $num, $current }) =>
		$num === $current ? COLORS.backgroundSelection : "transparent"};

	label {
		width: 60%;
		padding: 0 2px;
	}
`

export const EmptyItem = styled.li`
	margin: 10px 0;
`

export const Right = styled.div`
	width: 40%;
	border-style: solid;
	border-width: ${FULL.borderSize};
	border-color: ${COLORS.border};

	border-left-width: ${`calc(${FULL.borderSize} / 2)`};
	padding: ${FULL.padding};

	h3 {
		margin: 0;
		padding-bottom: ${FULL.padding};
		text-align: center;
		border-bottom-style: solid;
		border-bottom-width: ${FULL.borderSize};
		border-bottom-color: ${COLORS.border};
	}
`

export const Message = styled.div`
	position: absolute;
	background: ${COLORS.backgroundMessage};
	width: 50%;
	left: calc(50% - 25%);
	top: 40%;
	padding: ${FULL.padding};

	> p {
		padding: ${FULL.padding};
		margin: 0;
		border: solid 2px ${COLORS.borderMessage};
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		strong {
			margin: 4px 0 0 0;
		}
	}
`
