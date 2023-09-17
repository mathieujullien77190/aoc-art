/** @format */

import { GameConfig } from "../../constants"

export type WindowProps = {
	game: GameConfig
	args?: string[]
	onClose: () => void
}
