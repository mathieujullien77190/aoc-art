/** @format */

import { FeedMode, HighlightFill, Point } from "../types"

export type CameraProps = {
	label: string
	/** valeurs initiales ; chaque camera pilote ensuite les siennes */
	publicKey?: string
	cameraId?: string
	mode?: FeedMode
	asciiCols?: number
	highlightColor?: string
	tolerance?: number
	highlightFill?: HighlightFill
	/** zone d'analyse initiale ; vide = toute l'image */
	zone?: Point[]
}
