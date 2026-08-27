import {
	COLORS,
	MASTER_MIN,
	MASTER_STEP,
	OPTIONS,
	SCRIPT_SRC,
	SPREAD,
} from "./constants"
import { FlwGlobal, FlwOptions, Side, Size } from "./types"

let loading: Promise<FlwGlobal | null> | null = null

/**
 * Charge la bibliotheque une seule fois. Elle se pose sur window, d'ou la
 * balise script plutot qu'un import : il n'existe pas de paquet npm.
 */
export const loadFlw = (): Promise<FlwGlobal | null> => {
	if (window.Flw) return Promise.resolve(window.Flw)

	if (!loading) {
		loading = new Promise(resolve => {
			const script = document.createElement("script")
			script.src = SCRIPT_SRC
			script.async = true
			script.onload = () => resolve(window.Flw || null)
			script.onerror = () => resolve(null)
			document.body.appendChild(script)
		})
	}

	return loading
}

export const viewport = (): Size => ({
	width: window.innerWidth,
	height: window.innerHeight,
})

/** taille du canvas d'une plante : deux fois son emprise, toute la hauteur */
export const plantSize = (screen: Size): Size => ({
	width: SPREAD * 2,
	height: screen.height,
})

/**
 * Decalage horizontal du canvas. La tige part du bas au centre : caler ce
 * centre sur le bord fait pousser la plante dans le coin, la moitie
 * inutile debordant hors de l'ecran.
 */
export const plantLeft = (screen: Size, side: Side): number =>
	side === "left" ? -SPREAD : screen.width - SPREAD

/**
 * Les couleurs ne se donnent pas en hexa, la lib attend ses objets. La
 * tige maitresse, elle, s'allonge avec la hauteur de l'ecran.
 */
export const buildOptions = (flw: FlwGlobal, screen: Size): FlwOptions => ({
	...OPTIONS,
	maxDeepnessMaster: Math.max(
		MASTER_MIN,
		Math.round(screen.height / MASTER_STEP)
	),
	colorStart: flw.Color.createWithHex(COLORS.colorStart),
	colorEnd: flw.Color.createWithHex(COLORS.colorEnd),
	headColor: flw.Color.createWithHex(COLORS.headColor),
	leafColor: flw.Color.createWithHex(COLORS.leafColor),
})
