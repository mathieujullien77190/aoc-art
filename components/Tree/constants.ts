import { TreeParams, Vec3 } from "./types"

export const SEED = 5

/** Share of the radius a limb loses along its length. */
export const TAPER = 0.45

/** A fixed view: the tree cannot be turned, moved or zoomed. */
export const CAMERA: {
	fov: number
	position: Vec3
	target: Vec3
} = {
	fov: 35,
	position: [-2.2, 2.2, 7],
	target: [0, 1.9, 0],
}

/** Segments of the trunk; the birdhouse stands on the fourth. */
export const TRUNK_SEGMENTS = 5
export const HOUSE_SEGMENT = 4

/** How far (px) the foot of the trunk sinks below the screen's bottom edge. */
export const FOOT_BLEED = 8

/** How far the birdhouse's back sinks into the bark. */
export const HOUSE_SINK = 0.012

/** Falling leaves: how many, and how they drift (units, seconds). */
export const FALL = {
	count: 18,
	speed: [0.18, 0.34],
	sway: [0.08, 0.2],
	/** pushed toward the left of the screen, away from the edge the tree stands against */
	wind: -0.05,
	size: [0.035, 0.07],
	/** the height they vanish at, in world units: the foot of the trunk */
	floor: -0.1,
}

/** A left press that moves less than this (px) is a click. */
export const CLICK_SLOP = 5

/** The oak of the old low-poly workshop. */
export const PARAMS: TreeParams = {
	trunkH: 2,
	limbLen: 1.4,
	trunkW: 0.3,
	levels: 3,
	kids: 2,
	angle: 34,
	wind: -0.45,
	lenR: 0.62,
	radR: 0.7,
	curv: 0.55,
	twist: 0.5,
	droop: 0.05,
	irr: 0.6,
	density: 95,
	leafSize: 0.4,
	leafVar: 0.3,
	squash: 0.8,
	mix: 40,
	leafColor: "#d9701e",
	leafColor2: "#b3321f",
	barkColor: "#5a4630",
}
