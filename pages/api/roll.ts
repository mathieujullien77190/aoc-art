import { kv } from "@vercel/kv"
import { NextApiRequest, NextApiResponse } from "next"

import { createHTTPError, createHTTPSuccess, extractSubKeys } from "./helpers"
import { createArray } from "_games/helpers/utils"

import { getPlayerStatus, Player } from "_games/components/days/retro"

const shuffle = arr => [...arr.sort(() => Math.random() - 0.5)]

const characters = [
	"Loup-garou",
	"Salvateur",
	"Voyante",
	"Idiot",
	"Sorciere",
	"Maire",
]

export default async (request: NextApiRequest, response: NextApiResponse) => {
	try {
		const playerKeys = await kv.keys("players:*")
		const players = (await Promise.all(
			extractSubKeys("players", playerKeys).map(name =>
				kv.hgetall(`players:${name}`).then(player => ({ ...player, name }))
			)
		)) as Player[]

		if (!!request.query.start) {
			const filterPlayers = players.filter(
				player => getPlayerStatus(player.time) === "active"
			)

			const calculatedCharacters = shuffle(
				createArray(filterPlayers.length).map(
					(_, i) => characters[i % characters.length]
				)
			)
			const playersCharacter = filterPlayers.map((player, i) => ({
				...player,
				character: calculatedCharacters[i],
			}))

			await Promise.all(
				playersCharacter.map(({ name, nickName, code, time, character }) =>
					kv.hset(`players:${name}`, {
						nickName,
						code: `"${code}"`,
						time,
						character,
					})
				)
			)

			await kv.set("start", true)

			return createHTTPSuccess({
				response,
				data: { playersCharacter, start: true },
			})
		} else if (!!request.query.stop) {
			await Promise.all(
				players.map(({ name }) => kv.hdel(`players:${name}`, "character"))
			)

			await kv.set("start", false)

			const playersUpdate = (await Promise.all(
				extractSubKeys("players", playerKeys).map(name =>
					kv.hgetall(`players:${name}`).then(player => ({ ...player, name }))
				)
			)) as Player[]

			return createHTTPSuccess({
				response,
				data: { playersUpdate, start: false },
			})
		} else {
			return createHTTPError({ response, code: "REQUEST_ERROR" })
		}
	} catch (error) {
		console.log("REDIS_ERROR", error)
		return createHTTPError({ response, code: "REDIS_ERROR" })
	}
}
