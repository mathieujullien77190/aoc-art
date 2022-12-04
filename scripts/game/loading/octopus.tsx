/** @format */

/** @format */

import { lazy } from "react"
import Dynamic from "./Dynamic"

const LazyComponent = lazy(() => import("../components/octopus"))

const Game = () => (
	<Dynamic>
		<LazyComponent />
	</Dynamic>
)

export default Game
