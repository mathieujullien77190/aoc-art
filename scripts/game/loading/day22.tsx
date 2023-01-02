/** @format */

/** @format */

import { lazy } from "react"
import Dynamic from "./Dynamic"

const LazyComponent = lazy(() => import("../components/day22"))

const Game = () => (
	<Dynamic>
		<LazyComponent />
	</Dynamic>
)

export default Game
