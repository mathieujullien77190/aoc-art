import { FlwOptions } from "./types"

/**
 * Platane's library, vendored in public: it declares itself global on
 * window, there is no npm package.
 * https://github.com/Platane/Procedural-Flower (MIT)
 */
export const SCRIPT_SRC = "/vendor/flw/Flw.min.js"

/** wait before replanting after a resize: the plant rebuilds from scratch */
export const REBUILD_MS = 400

/** below this gap, the window has not moved enough to replant */
export const RESIZE_THRESHOLD = 40

/**
 * Visible width of a plant, in pixels. Its canvas is twice that: the lib
 * starts the stem at the bottom centre, so half falls off screen and the
 * plant grows right in the corner.
 */
export const SPREAD = 420

/**
 * Height gained per step of the master stem, in pixels. Used to derive
 * maxDeepnessMaster from the screen height: without it the plant stops
 * halfway. The order of magnitude comes from radius, curvature does the
 * rest.
 */
export const MASTER_STEP = 48

/** minimum steps, so a short screen still gets a plant */
export const MASTER_MIN = 8

/**
 * The demo's greenHill setting, colours aside. The four colour entries are
 * converted to Flw.Color once the lib is loaded.
 */
export const COLORS = {
	colorStart: "#153906",
	colorEnd: "#52910b",
	headColor: "#ffcc6a",
	leafColor: "#246410",
}

export const OPTIONS: FlwOptions = {
	widthStart: 4.4,
	widthEnd: 0.8,

	/*
	 * Values of the demo's greenHill setting. Raising maxDeepness gives more
	 * leaves and maxDeepnessMajor more flowers (a leaf on every fifth node, a
	 * head at the end of each master branch), but the tree is built at once at
	 * startup, grows fast and gets bushy.
	 */
	maxDeepness: 3,
	maxDeepnessVar: 2,
	maxDeepnessTwisted: 5,
	maxDeepnessTwistedVar: 0,
	maxDeepnessMajor: 2,
	maxDeepnessMajorVar: 2,
	// maxDeepnessMaster is computed on the fly, it depends on the height
	maxDeepnessMasterVar: 4,
	headSize: 30,
	headSizeVar: 30,
	leafSize: 24,
	leafSizeVar: 8,
	headColorTintVar: 28.3,
	headColorValueVar: 0.168,
	headColorSatVar: 0.11,
	leafColorTintVar: 24.2,
	leafColorValueVar: 0.2,
	leafColorSatVar: 0.2,
	radius: 55,
	radiusVar: 70,
	globalDirection: Math.PI / 2,
	growVelocity: 0.12,
	strokeBranchWidth: 0,
	strokeBranchColor: "#5c5c5c",
	strokeLeafWidth: 0.1,
	strokeLeafColor: "#161616",
	strokeHeadWidth: 0.2,
	strokeHeadColor: "#1b1b1b",
}
