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

/** Loads the library once: it sets itself on window (no npm package), hence a script tag. */
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

/** canvas size of a plant: twice its footprint, full height */
export const plantSize = (screen: Size): Size => ({
	width: SPREAD * 2,
	height: screen.height,
})

/**
 * Horizontal canvas offset. The stem starts at the bottom centre: putting
 * that centre on the edge grows the plant in the corner, the useless half
 * overflowing the screen.
 */
export const plantLeft = (screen: Size, side: Side): number =>
	side === "left" ? -SPREAD : screen.width - SPREAD

/** Colours are not hex: the lib expects its own objects. The master stem grows with screen height. */
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
