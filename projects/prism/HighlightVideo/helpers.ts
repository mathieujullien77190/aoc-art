/** @format */

import { HIGHLIGHT_MIN_SATURATION } from "../constants"
import { hue, hueDistance, saturation } from "../helpers"

/**
 * Le pixel est-il assez proche de la teinte visee ?
 * Le tri porte sur la teinte et non sur la distance RVB, pour qu'un ton
 * sombre et un ton clair de la meme couleur soient retenus tous les deux.
 * La saturation minimale ecarte les gris, dont la teinte n'a pas de sens.
 */
export const matchesHue = (
	r: number,
	g: number,
	b: number,
	target: number,
	tolerance: number
): boolean =>
	target >= 0 &&
	saturation(r, g, b) >= HIGHLIGHT_MIN_SATURATION &&
	hueDistance(hue(r, g, b), target) <= tolerance
