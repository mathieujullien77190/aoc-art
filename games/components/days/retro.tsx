/** @format */
import React, { useEffect, useState } from "react"
import styled from "styled-components"

export const listPlayers = [
	{ name: "mathieu", pseudo: "Matou" },
	{ name: "romain", pseudo: "Chef" },
	{ name: "charlotte", pseudo: "Chacha" },
	{ name: "sebastien", pseudo: "Seb" },
]

const Container = styled.div`
	height: calc(100% - 70px);
	display: flex;
	flex-direction: column;
	padding: 60px 20px 10px 20px;
	overflow-y: auto;
`

const Content = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	width: 100%;
`

const getId = (name: string): string => {
	return name
		.split("")
		.map(item => ("000" + item.charCodeAt(0)).substr(-3))
		.join("")
}

const getPseudo = (name: string, id: string) => {
	const search = listPlayers.filter(
		item => name === item.name && id === getId(name)
	)

	if (search.length === 1) return search[0].pseudo
	return `Relou_${name}`
}

const Animation = ({ args }: { args?: string[] }) => {
	const pseudo = getPseudo(args[0], args[1])

	return (
		<Container>
			<Content>Bienvenue {pseudo}</Content>
		</Container>
	)
}

export default Animation
