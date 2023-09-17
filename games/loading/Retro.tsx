/** @format */

import { lazy } from "react"
import Dynamic from "./Dynamic"

const LazyComponent = lazy(() => import("_games/components/days/retro"))

const Game = ({ args }: { args?: string[] }) => (
	<Dynamic>
		<LazyComponent args={args} />
	</Dynamic>
)

export default Game
