/** @format */

import { useEffect, useState } from "react"

import { read } from "../helpers"

const stats = ({ countView, countChar, totalView, vps, speed }) => {
	return `

--------------------------------------
| Stats :                            |
|                                    |
| Total frame : ${(totalView.toLocaleString() + "             ").substring(
		0,
		13
	)}        |
| Current frame : ${(countView.toLocaleString() + "             ").substring(
		0,
		13
	)}      |
| FPS: ${(
		vps.toLocaleString() +
		" / " +
		1000 / speed +
		"             "
	).substring(0, 13)}                 |
| Char displayed : ${(countChar.toLocaleString() + "             ").substring(
		0,
		13
	)}     |
--------------------------------------
`
}

export const useAnim = (viewsFn: () => string[], speed: number = 20) => {
	let timer
	const [HTML, setHTML] = useState<string>("")

	useEffect(() => {
		const views = viewsFn()
		const totalView = views.length

		let countChar = 0
		let countView = 0
		const start = new Date().getTime()

		timer = read(views, speed, ({ item: view, i }) => {
			countChar += view.length
			countView++
			const now = new Date().getTime()

			const vps = (countView / ((now - start) / 1000)).toFixed(1)

			setHTML(view + stats({ countView: i, countChar, totalView, vps, speed }))
		})

		return () => {
			clearInterval(timer)
		}
	}, [])

	return HTML
}
