/** @format */
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { createArray } from "_games/helpers/utils"

import D3 from "_games/components/D3"
import { WrapperContainer3D } from "_games/components/Containers"

type Player = {
	name: string
	code: string
	nickName: string
	time?: number
}

type Status = "active" | "inactive" | "disconnected"

export const listPlayers = [
	{ name: "mathieu", pseudo: "Matou" },
	{ name: "romain", pseudo: "Chef" },
	{ name: "charlotte", pseudo: "Chacha" },
	{ name: "sebastien", pseudo: "Seb" },
]

const TIME_REFRESH = 500000
const PLAYER_ACTIVE = TIME_REFRESH * 2
const PLAYER_DISCONNECTED = TIME_REFRESH * 4

const Content = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	border: dashed 2px white;
`

export const Container = styled.div`
	display: flex;
`

export const getCode = (name: string): string => {
	return name
		.split("")
		.map(item => ("000" + item.charCodeAt(0)).substr(-3))
		.join("")
}

const getNickName = ({ name, code }: { name: string; code: string }) => {
	const search = listPlayers.filter(
		item => name === item.name && code === getCode(name)
	)

	if (search.length === 1) return search[0].pseudo
	return `Relou_${name}`
}

const refresh = async ({
	name,
	nickName,
	code,
}: Player): Promise<{ players: Player[]; start: boolean }> => {
	const query = new URLSearchParams({
		name,
		code,
		nickName,
	})

	const response = await fetch(`api/refresh?${query}`).then(response =>
		response.json()
	)

	return response.data
}

const getPlayerStatus = (timePlayer: number): Status => {
	const currentTime = new Date().getTime()
	if (timePlayer + PLAYER_ACTIVE > currentTime) return "active"
	if (timePlayer + PLAYER_DISCONNECTED > currentTime) return "inactive"
	return "disconnected"
}

const getPlayerStatusColor = (status: Status): string => {
	return (
		{ inactive: "orange", active: "green", disconnected: "red" }[status] ??
		"red"
	)
}

const getPlayerStatusTimer = (timePlayer: number): number => {
	return Math.floor((new Date().getTime() - timePlayer) / 1000)
}

const getPlayerText = (player: Player): string => {
	const timer = getPlayerStatusTimer(player.time)
	const status = getPlayerStatus(player.time)

	if (status === "active") return `[actif] - ${player.nickName}`
	if (status === "inactive") return `[inactif] (${timer}s) - ${player.nickName}`
	if (status === "disconnected") return `[deconnecté] - ${player.nickName}`
	return ""
}

const updateTable = (players: Player[]): string => {
	const player = "JOUEUR"
	const maxLength = Math.max(...players.map(player => player.nickName.length))
	const diff = maxLength - player.length

	const addBar = createArray(Math.max(diff, 0))
		.map(() => "-")
		.join("")
	const addSpace = createArray(Math.max(diff, 0))
		.map(() => " ")
		.join("")
	const closeTab = createArray(Math.max(diff, 0) + player.length)
		.map(() => "-")
		.join("")
	const playersStr = players
		.map(p => {
			const addSpace = createArray(
				Math.max(Math.max(maxLength, player.length) - p.nickName.length, 0)
			)
				.map(() => " ")
				.join("")
			return `| ${p.nickName}${addSpace} | DECONNECTE | -          |`
		})
		.join("\n")
	const lastStr = `+-${closeTab}-+------------+------------+`

	return `
Liste des joueurs : 

+-------${addBar}-+------------+------------+			   
| ${player} ${addSpace}| STATUS     | PERSONNAGE |
+-------${addBar}-+------------+------------+
${playersStr}
${lastStr}`
}

const card = ({ width, height }: { height: number; width: number }): string => {
	const content = (carac: string) =>
		createArray(width)
			.map(() => carac)
			.join("")
	const topBot = "+" + content("-") + "+"

	const body = createArray(height)
		.map(() => `|${content(" ")}|`)
		.join("\n")

	return `
Votre Carte : 

${topBot}
${body}
${topBot}
	`
}

const Animation = ({ args }: { args?: string[] }) => {
	const [me, setMe] = useState<Player>()
	const [all, setAll] = useState<Player[]>([])

	const players = [{ nickName: "u" }, { nickName: "ddddddd" }] as Player[]

	// useEffect(() => {
	// 	const [name, code] = args
	// 	const nickName = getNickName({ name, code })
	// 	setMe({ name, nickName, code, time: new Date().getTime() })

	// 	refresh({ name, nickName, code }).then(data => {
	// 		setAll(data.players)
	// 	})
	// 	const timer = setInterval(() => {
	// 		refresh({ name, nickName, code }).then(data => {
	// 			setAll(data.players)
	// 		})
	// 	}, TIME_REFRESH)

	// 	return () => {
	// 		clearInterval(timer)
	// 	}
	// }, [])

	return (
		<WrapperContainer3D>
			<D3
				size={{ width: 1000, height: 600 }}
				margin={-100}
				zoom={{ value: 10, min: 1, max: 20, step: 1, bigStep: 2 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				start={{ H: 20, V: 40 }}
			>
				<Content>
					<Container>
						<pre>{updateTable(players)}</pre>
						<pre>{card({ width: 20, height: 15 })}</pre>
					</Container>

					{/* <p>Bienvenue {me?.nickName}</p>
				<ul>
					{all.map(({ name, nickName, code, time }) => {
						const status = getPlayerStatus(time)

						return (
							<li key={code} style={{ color: getPlayerStatusColor(status) }}>
								{getPlayerText({ name, nickName, code, time })}
							</li>
						)
					})}
				</ul> */}
				</Content>
			</D3>
		</WrapperContainer3D>
	)
}

export default Animation
