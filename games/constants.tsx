import type { JSX } from "react"

import Game2021 from "./loading/2021"
import GameDay1 from "./loading/day1"
import GameDay4 from "./loading/day4"
import GameDay5 from "./loading/day5"
import GameDay9 from "./loading/day9"
import GameDay12 from "./loading/day12"
import GameDay14 from "./loading/day14"
import GameDay18 from "./loading/day18"
import GameDay22 from "./loading/day22"
import GameDay15 from "./loading/day15"
import GameDay8 from "./loading/day8"
import GameDay10 from "./loading/day10"
import GameDay142 from "./loading/day142"
import GameDay21 from "./loading/day21"
import GamePlayground from "./loading/playground"

import { gameKey, gamesMeta, GameMeta } from "./meta"

export type GameConfig = GameMeta & {
	component: () => JSX.Element
}

/** each game's render, by year-day key (see meta.ts) */
const components: Record<string, () => JSX.Element> = {
	"2021-25": () => <Game2021 />,
	"2022-1": () => <GameDay1 />,
	"2022-4": () => <GameDay4 />,
	"2022-5": () => <GameDay5 />,
	"2022-9": () => <GameDay9 />,
	"2022-12": () => <GameDay12 />,
	"2021-15": () => <GameDay15 />,
	"2022-14": () => <GameDay14 />,
	"2022-18": () => <GameDay18 />,
	"2022-22": () => <GameDay22 />,
	"2023-8": () => <GameDay8 />,
	"2023-10": () => <GameDay10 />,
	"2023-14": () => <GameDay142 />,
	"2023-21": () => <GameDay21 />,
	"XXXX-XX": () => <GamePlayground />,
}

export const gamesConfig: GameConfig[] = gamesMeta.map(meta => ({
	...meta,
	component: components[gameKey(meta)],
}))
