/** @format */

import { useEffect, useState } from "react"

import { read } from "../helpers"

export const useAnim = (views: string[]) => {
	let timer
	const [HTML, setHTML] = useState<string>("")

	useEffect(() => {
		timer = read(views, 20, ({ item, i }) => setHTML(item))

		return () => {
			clearInterval(timer)
		}
	}, [])

	return HTML
}
