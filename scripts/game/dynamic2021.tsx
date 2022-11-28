/** @format */

import { useEffect, useState } from "react"
import { data } from "../data/2021"
import { read } from "./helpers"

type AnimationProps = { time: number }

const Animation = ({ time }: AnimationProps) => {
	let timer
	const [text, setText] = useState<string>("")

	useEffect(() => {
		timer = read(data, time, item => setText(item))

		return () => {
			clearInterval(timer)
		}
	}, [])

	return <pre style={{ fontSize: "10px", lineHeight: "6px" }}>{text}</pre>
}

export default Animation
