/** @format */

import { useAnim } from "./hooks"
import { generateViews } from "../core/day4"

const Animation = () => {
	const html = useAnim(() => generateViews(25), 20)

	return (
		<pre style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
	)
}

export default Animation
