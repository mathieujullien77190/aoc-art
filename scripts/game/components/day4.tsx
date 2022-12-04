/** @format */

import { useEffect, useState } from "react"
import { generateViews } from "../core/day4"
import { read } from "../helpers"

const Animation = () => {
	const [html, setHTML] = useState<string>("")

	useEffect(() => {
		let timer
		const views = generateViews(30)

		timer = read(views, 1, ({ item }) => {
			setHTML(item)
		})

		return () => {
			clearInterval(timer)
		}
	}, [])

	return (
		<pre style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
	)
}

export default Animation
