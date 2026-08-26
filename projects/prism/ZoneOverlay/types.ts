import { Point } from "../types"

export type ZoneOverlayProps = {
	points: Point[]
	/** quand vrai, l'overlay capte les clics au lieu de les laisser passer */
	editing: boolean
	onAddPoint?: (point: Point) => void
	onMovePoint?: (index: number, point: Point) => void
}
