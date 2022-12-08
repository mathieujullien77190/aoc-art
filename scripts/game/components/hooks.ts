/** @format */

import { useEffect, useState, useMemo } from "react"

import { read, View } from "../view"

const getStats = ({
	countView,
	nbsView,
	countChar,
	totalView,
	speed,
	dataSize,
}) => {
	const size = 34
	const add = "                                 "

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

	const speedD = ("Speed : " + speed + add).substring(0, size)

	const c = ("Char displayed : " + countChar.toLocaleString() + add).substring(
		0,
		size
	)
	const d = dataSize
		? ("% data : " + dataSize + "%" + add).substring(0, size)
		: ("% data : -" + add).substring(0, size)

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
| ${speedD} | 
| ${c} | 
| ${d} | 
|                                    | 
------------------------------------  
`
}

type UseAnimProps = {
	viewsFn: () => View[]
	transform?: ({ view, i }: { view: View; i: number }) => {
		view: View
		i: number
	}
	dataSize?: number
	speed: number
	reload: number
}

export const useAnim = ({
	viewsFn,
	transform = ({ view, i }) => ({ view, i }),
	dataSize,
	speed,
	reload,
}: UseAnimProps) => {
	let timer
	const [HTML, setHTML] = useState<string>("")
	const [stats, setStats] = useState<string>("")

	const views = useMemo(() => viewsFn(), [dataSize])
	const calcSpeed = useMemo(() => (speed === 0 ? 1 : speed), [speed])

	useEffect(() => {
		const totalView = views.length

		let countChar = 0
		let countView = 0

		clearInterval(timer)

		timer = read(views, calcSpeed, args => {
			const { view, i } = transform(args)
			countChar += view.value.length
			countView++

			setHTML(view.value)
			setStats(
				getStats({
					nbsView: countView,
					countView: i + 1,
					countChar,
					totalView,
					dataSize,
					speed: calcSpeed,
				})
			)
		})

		return () => {
			clearInterval(timer)
		}
	}, [calcSpeed, reload, dataSize])

	return { HTML, stats }
}
