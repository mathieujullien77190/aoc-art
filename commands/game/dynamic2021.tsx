/** @format */

import { useEffect, useState } from "react"
import { data } from "../data/2021"
import { read } from "./helpers"

type AnimationProps = { time: number }

const Animation = ({ time }: AnimationProps) => {
	const [text, setText] = useState<string>("")

	useEffect(() => {
		read(data, time, item => setText(item))
	}, [])

	return <pre style={{ fontSize: "10px", lineHeight: "6px" }}>{text}</pre>
}

export default Animation
