/** @format */

import { useEffect, useState } from "react"
import { generateViews, extractMax } from "../core/day1"
import { read } from "../helpers"

const Animation = () => {
	const [html, setHTML] = useState<string>("")

	useEffect(() => {
		const views = generateViews(60)
		const pos = Math.floor(60 / 2) - 3
		let theBest = 0

		const timer = read(views, 40, ({ item, i }) => {
			const item1 = item.substring(0, pos)
			const item2 = item.substring(pos, pos + 6)
			const item3 = item.substring(pos + 6)

			theBest = extractMax(item2, theBest)

			setHTML(
				`${item1}<span style="color:red;">${item2}</span>${item3}\n\nScan : <span style="color:red;">${item2}</span>\nBest : ${theBest}`
			)
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
