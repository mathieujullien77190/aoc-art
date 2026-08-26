import { Point } from "../types"

/**
 * Position du curseur en coordonnees normalisees (0..1).
 * null si le cadre n'a pas encore de taille.
 */
export const toNormalized = (
	rect: DOMRect,
	clientX: number,
	clientY: number
): Point | null =>
	rect.width && rect.height
		? {
				x: (clientX - rect.left) / rect.width,
				y: (clientY - rect.top) / rect.height,
			}
		: null

/** index du sommet sous la position donnee, -1 sinon */
export const findVertexAt = (
	points: Point[],
	position: Point,
	radiusX: number,
	radiusY: number
): number =>
	points.findIndex(
		point =>
			Math.abs(point.x - position.x) <= radiusX &&
			Math.abs(point.y - position.y) <= radiusY
	)
