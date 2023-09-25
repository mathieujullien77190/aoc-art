import { kv } from "@vercel/kv"
import { NextApiRequest, NextApiResponse } from "next"

import { createHTTPError, createHTTPSuccess, extractSubKeys } from "./helpers"
import { getCode } from "_games/components/days/retro"

export default async (request: NextApiRequest, response: NextApiResponse) => {
	if (
		request.query.name &&
		request.query.nickName &&
		request.query.code &&
		getCode(request.query.name.toString()) === request.query.code
	) {
		const name = request.query.name
		const nickName = request.query.nickName
		const code = request.query.code.toString()

		try {
			await kv.hset(`players:${name}`, {
				nickName,
				code: `"${code}"`,
				time: new Date().getTime(),
			})

			const playerKeys = await kv.keys("players:*")

			const players = await Promise.all(
				extractSubKeys("players", playerKeys).map(name =>
					kv.hgetall(`players:${name}`).then(player => ({
						name,
						nickName: player.nickName,
						time: player.time,
						code: request.query.code === player.code ? code : undefined,
						character:
							request.query.code === player.code ? player.character : undefined,
					}))
				)
			)

			const start = await kv.get("start")

			return createHTTPSuccess({ response, data: { players, start } })
		} catch (error) {
			console.log("REDIS_ERROR", error)
			return createHTTPError({ response, code: "REDIS_ERROR" })
		}
	} else {
		return createHTTPError({ response, code: "REQUEST_ERROR" })
	}
}
