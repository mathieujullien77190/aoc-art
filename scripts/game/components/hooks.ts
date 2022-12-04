/** @format */

import { useEffect, useState, useMemo } from "react"

import { read } from "../helpers"

const end = `-----------------------
|        END          |
|                     |
| Cliquez pour fermer |
----------------------
				`

const getStats = ({ countView, nbsView, countChar, totalView, vps, speed }) => {
	const size = 34
	const add = "                         "

	const totalFrame = (
		"Total frame : " +
		totalView.toLocaleString() +
		add
	).substring(0, size)
	const currentFrame = (
		"Current frame : " +
		countView.toLocaleString() +
		add
	).substring(0, size)
	const nbsFrame = (
		"Frame displayed : " +
		nbsView.toLocaleString() +
		add
	).substring(0, size)
	const fps = (
		"FPS : " +
		vps.toLocaleString() +
		" / " +
		1000 / speed +
		add
	).substring(0, size)
	const speedD = ("Speed : " + speed + add).substring(0, size)

	const c = ("Char displayed : " + countChar.toLocaleString() + add).substring(
		0,
		size
	)

	return ` ------------------------------------  
| Infos :                            | 
|                                    | 
| pour Arrêter cliquez n'importe où  |
|                                    | 
| Stats :                            | 
|                                    | 
| ${totalFrame} | 
| ${currentFrame} |
| ${nbsFrame} | 
| ${fps} | 
| ${speedD} | 
| ${c} | 
|                                    | 
------------------------------------  
`
}

type UseAnimProps = {
	viewsFn: () => string[]
	transform?: ({ view, i }: { view: string; i: number }) => {
		view: string
		i: number
	}
	speed: number
	reload: number
}

export const useAnim = ({
	viewsFn,
	transform = ({ view, i }) => ({ view, i }),
	speed,
	reload,
}: UseAnimProps) => {
	let timer
	const [HTML, setHTML] = useState<string>("")
	const [stats, setStats] = useState<string>("")

	const views = useMemo(() => viewsFn(), [])
	const calcSpeed = useMemo(
		() => (speed <= 0 ? 1 : speed > 1000 ? 1000 : speed),
		[speed]
	)

	useEffect(() => {
		const totalView = views.length

		let countChar = 0
		let countView = 0
		const start = new Date().getTime()

		clearInterval(timer)

		timer = read(
			views,
			calcSpeed,
			args => {
				const { view, i } = transform(args)
				countChar += view.length
				countView++
				const now = new Date().getTime()

				const vps = (countView / ((now - start) / 1000)).toFixed(1)

				setHTML(view)
				setStats(
					getStats({
						nbsView: countView,
						countView: i + 1,
						countChar,
						totalView,
						vps,
						speed: calcSpeed,
					})
				)
			},
			() => setHTML(end)
		)

		return () => {
			clearInterval(timer)
		}
	}, [calcSpeed, reload])

	return [HTML, stats]
}
