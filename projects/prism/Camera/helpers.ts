/** @format */

import { Point } from "../types"

/** remplace un sommet sans muter la liste d'origine */
export const replacePoint = (
	points: Point[],
	index: number,
	point: Point
): Point[] => points.map((item, i) => (i === index ? point : item))
