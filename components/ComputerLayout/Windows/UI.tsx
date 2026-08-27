import styled from "styled-components"
import { FULL, COLORS } from "./constants"

export const Container = styled.div`
	width: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
	height: ${`calc(100% - ${FULL.padding} - ${FULL.padding})`};
	padding: ${FULL.padding};
`

export const Bar = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: ${FULL.heightBar};
	border-top-style: solid;
	border-top-width: ${FULL.borderSize};
	border-top-color: ${COLORS.border};
	background-color: ${COLORS.bar};
	display: flex;
	color: ${COLORS.text};
	align-items: center;
	justify-content: end;
	gap: 6px;
	padding: 0 ${FULL.padding};
`

/** les fenetres ouvertes, poussees a gauche par l'heure */
export const Tasks = styled.div`
	display: flex;
	gap: 6px;
	margin-right: auto;
	overflow: hidden;
`

export const Task = styled.div<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 4px;
	max-width: 160px;
	padding: 1px 8px;
	cursor: pointer;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	border: solid 1px ${COLORS.border};
	border-radius: 3px;

	/* la fenetre au premier plan s'affiche enfoncee */
	background-color: ${({ $active }) => ($active ? "#00000022" : "transparent")};
	box-shadow: ${({ $active }) => ($active ? "inset 1px 1px 2px #00000033" : "none")};

	&:hover {
		background-color: #00000014;
	}
`

export const Date = styled.div``
