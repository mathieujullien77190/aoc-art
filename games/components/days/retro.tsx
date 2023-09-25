/** @format */
import React, {
	useEffect,
	useState,
	useMemo,
	useRef,
	MutableRefObject,
} from "react"
import Image from "next/image"
import styled from "styled-components"

import { createArray } from "_games/helpers/utils"
import D3 from "_games/components/D3"
import { WrapperContainer3D } from "_games/components/Containers"

export type Player = {
	name: string
	code: string
	nickName: string
	time?: number
	character?: string
}

export type Status = "active" | "inactive" | "disconnected"

export const listPlayers = [
	{ name: "mathieu", nickName: "Matou" },
	{ name: "romain", nickName: "Chef" },
	{ name: "charlotte", nickName: "Chacha" },
	{ name: "sebastien", nickName: "Seb" },
	{ name: "marilyn", nickName: "MarYlInE" },
	{ name: "maxime", nickName: "Maxou" },
	{ name: "nidavone", nickName: "Nida" },
	{ name: "loris", nickName: "Titch" },
	{ name: "steven", nickName: "Steven" },
]

const TIME_REFRESH = 5000
const PLAYER_ACTIVE = TIME_REFRESH * 2
const PLAYER_DISCONNECTED = TIME_REFRESH * 4

export const getCode = (name: string): string => {
	return name
		.split("")
		.map(item => ("000" + item.charCodeAt(0)).substr(-3))
		.join("")
}

export const getName = (code: string): string =>
	code
		.match(/.{1,3}/g)
		.map(item => String.fromCharCode(parseInt(item, 10)))
		.join("")

export const getNickName = (name: string): string => {
	const search = listPlayers.filter(item => name === item.name)

	if (search.length === 1) return search[0].nickName
	return `unknown`
}

export const isValidPlayer = (code: string): boolean => {
	const name = getName(code)
	return getNickName(name) !== "unknown"
}

export const getPlayerStatus = (timePlayer: number): Status => {
	const currentTime = new Date().getTime()
	if (timePlayer + PLAYER_ACTIVE > currentTime) return "active"
	if (timePlayer + PLAYER_DISCONNECTED > currentTime) return "inactive"
	return "disconnected"
}

const Content = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	border: dashed 2px white;
	background-color: #1a1a1a;
	position: relative;

	p {
		position: absolute;
		top: 10px;
		left: 10px;
		margin: 0;
	}
`

export const Container = styled.div`
	display: flex;
`

export const Wolf = styled.pre`
	position: absolute;
	bottom: 0;
	font-size: 10px;
	left: 0;
	opacity: 0.2;
`

export const CardContainer = styled.div`
	display: flex;
	align-items: center;
	position: relative;
`

export const Photo = styled.div`
	margin: 0;
	width: calc(100% - 35px);
	height: calc(100% - 40px);
	position: absolute;
	z-index: 0;
	margin: 20px 20px 20px 15px;
`

export const Card = styled.pre`
	margin: 0;
	z-index: 1;

	.line {
		background: #0e0e0e;
		transition: all 0.5s ease-in;

		&.hidden {
			opacity: 0;
		}
	}
`

export const TableContainer = styled.div`
	display: flex;
	align-items: center;
`

export const Table = styled.pre`
	margin: 0;
	.active {
		color: green;
	}

	.inactive {
		color: orange;
	}

	.disconnected {
		color: red;
	}
`

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

const wolfAscii = () => {
	return `
                              __
                            .d$$b
                          .' TO$;\\
                         /  : TP._;
                        / _.;  :Tb|
                       /   /   ;j$j
                   _.-"       d$$$$
                 .' ..       d$$$$;
                /  /P'      d$$$$P. |\\
               /   "      .d$$$P' |\\^"l
             .'           \`T$P^"""""  :
         ._.'      _.'                ;
      \`-.-".-'-' ._.       _.-"    .-"
    \`.-" _____  ._              .-"
   -(.g$$$$$$$b.              .'
     ""^^T$$$P^)            .(:
       _/  -"  /.'         /:/;
    ._.'-'\`-'  ")/         /;/;
 \`-.-"..--""   " /         /  ;
.-" ..--""        -'          :
..--""--.-"         (\\      .-(\\
  ..--""              \`-\\(\\/;\`
    _.                      :
                            ;\`-
                           :\\
                           ;`
}

const getPlayerStatusStr = (timePlayer: number): string => {
	const status = getPlayerStatus(timePlayer)

	if (status === "active") return `actif     `
	if (status === "inactive") return `inactif   `
	if (status === "disconnected") return `déconnecté`
	return ""
}

const createLine = (carac: string, size: number) =>
	createArray(size)
		.map(() => carac)
		.join("")

const updateTable = (players: Player[], me: Player): string => {
	const player = "JOUEUR"
	const maxLength = Math.max(...players.map(player => player.nickName.length))
	const diff = maxLength - player.length

	const addBar = createLine("-", Math.max(diff, 0))
	const addSpace = createLine(" ", Math.max(diff, 0))
	const closeTab = createLine("-", Math.max(diff, 0) + player.length)

	const playersStr = players
		.filter(p => getPlayerStatus(p.time) !== "disconnected")
		.map(p => {
			const addSpace = createLine(
				" ",
				Math.max(Math.max(maxLength, player.length) - p.nickName.length, 0)
			)

			const replace = `<span class="${getPlayerStatus(p.time)}">$1</span>`

			const strCharacter = p.character
				? p.character + createLine(" ", 11 - p.character.length) + "|"
				: "-          |"

			return `${p.name === me.name ? "-> " : "   "}| @${
				p.nickName
			}@${addSpace} | #${getPlayerStatusStr(p.time)}# | ${strCharacter}`
				.replace(/@(.*)@/g, replace)
				.replace(/#(.*)#/g, replace)
		})
		.join("\n")
	const lastStr =
		players.length > 0 ? `   +-${closeTab}-+------------+------------+` : ""

	return `   +-------${addBar}-+------------+------------+			   
   | ${player} ${addSpace}| STATUS     | PERSONNAGE |
   +-------${addBar}-+------------+------------+
${playersStr}
${lastStr}`
}

const card = (): string => {
	const body = `+---------------------+
|@                     @|	
|@                     @|	
|@        ╔═══╗        @|
|@        ║╔═╗║        @|
|@        ╚╝╔╝║        @|
|@          ║╔╝        @|
|@          ╔╗         @|
|@          ╚╝         @|
|@                     @|	
|@                     @|	
+---------------------+
`.replace(/@(.*)@/g, '<span class="line">$1</span>')

	return body
}

const displayCard = async (
	ref: MutableRefObject<HTMLPreElement>,
	show: boolean
) => {
	if (ref?.current) {
		const lines = Array.from(ref.current.querySelectorAll(".line"))
		for (let line of lines) {
			await new Promise(resolve => setTimeout(resolve, 200))
			if (show) line.classList.add("hidden")
			else line.classList.remove("hidden")
		}
	}
}

const Animation = ({ code }: { code?: string }) => {
	const [me, setMe] = useState<Player>()
	const [all, setAll] = useState<Player[]>([])
	const refCard = useRef<HTMLPreElement>(null)

	useEffect(() => {
		const name = getName(code)
		const nickName = getNickName(name)
		setMe({ name, nickName, code, time: new Date().getTime() })

		refresh({ name, nickName, code }).then(data => {
			setAll(data.players)
			setMe(data.players.filter(player => player.code === code)[0])
		})
		const timer = setInterval(() => {
			refresh({ name, nickName, code }).then(data => {
				setAll(data.players)
				setMe(data.players.filter(player => player.code === code)[0])
			})
		}, TIME_REFRESH)

		return () => {
			clearInterval(timer)
		}
	}, [])

	const cardHTML = useMemo(() => card(), [])

	useEffect(() => {
		displayCard(refCard, !!me?.character)
	}, [me])

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
				start={{ H: 10, V: 20 }}
			>
				<Content>
					<p>
						Retro : Starlord
						<br />
						Thème : Loup-Garou
					</p>
					<Container>
						<TableContainer>
							<Table
								dangerouslySetInnerHTML={{ __html: updateTable(all, me) }}
							/>
						</TableContainer>

						<CardContainer>
							<Photo>
								{me?.character && (
									<Image
										alt="personnage"
										src={`/${me?.character}.png`}
										fill={true}
										objectFit="contain"
									/>
								)}
							</Photo>
							<Card
								ref={refCard}
								dangerouslySetInnerHTML={{
									__html: cardHTML,
								}}
							/>
						</CardContainer>

						<Wolf
							className="wolf"
							dangerouslySetInnerHTML={{
								__html: wolfAscii(),
							}}
						/>
					</Container>
				</Content>
			</D3>
		</WrapperContainer3D>
	)
}

export default Animation
