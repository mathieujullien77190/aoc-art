/** @format */

import { Point, VideoRef } from "../types"

export type MotionVideoProps = {
	videoRef: VideoRef
	/** polygone d'analyse ; vide = toute l'image */
	zone: Point[]
}
