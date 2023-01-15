/** @format */

import { lazy } from "react"
import Dynamic from "./Dynamic"

const LazyComponent = lazy(() => import("_games/components/days/day4"))

const Game = () => (
	<Dynamic>
		<LazyComponent />
	</Dynamic>
)

export default Game
