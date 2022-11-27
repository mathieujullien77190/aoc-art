/** @format */

import { useEffect, useState } from "react"

type useDisplayByLetterProps = {
	baseTxt: string
	canRendered: boolean
	animation: boolean
	lang: string
	reverse: boolean
	stepTime: number
	stepSize: number
}

export const useDisplayByLetter = ({
	baseTxt,
	canRendered,
	animation,
	lang,
	reverse,
	stepTime = 10,
	stepSize,
}: useDisplayByLetterProps) => {
	const [textTime, setTextTime] = useState<string>("")
	const [finish, setFinish] = useState<boolean>(false)
	useEffect(() => {
		if (canRendered) {
			const j = stepSize ? stepSize : Math.floor(baseTxt.length / 100) + 1
			let i = 0

			const timer = setInterval(() => {
				setTextTime(
					animation
						? !reverse
							? baseTxt.substr(0, i + 1)
							: baseTxt.substr(-(i + 1))
						: baseTxt
				)

				if (i > baseTxt.length - 1) {
					clearInterval(timer)
					setFinish(true)
				}
				i = i + j
			}, stepTime)
		}
	}, [canRendered])

	useEffect(() => {
		if (finish) setTextTime(baseTxt)
	}, [lang])
	return { txt: textTime, finish }
}
