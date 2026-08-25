/** @format */

import { FeedMode, HighlightFill } from "../types"

export type CameraProps = {
	/** index initial dans CAMERAS ; modifiable ensuite via le selecteur */
	index?: number
	/** valeurs initiales de rendu */
	mode?: FeedMode
	asciiCols?: number
	highlightColor?: string
	tolerance?: number
	highlightFill?: HighlightFill
}
