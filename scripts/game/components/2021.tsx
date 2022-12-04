/** @format */

import { useAnim } from "./hooks"

import { data } from "../data/2021"

const Animation = () => {
	const html = useAnim(() => data)

	return (
		<pre style={{ fontSize: "10px", lineHeight: "6px", margin: 0 }}>{html}</pre>
	)
}

export default Animation
