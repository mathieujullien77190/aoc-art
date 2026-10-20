export type Vec3 = [number, number, number]

/** Shape and colours of a broadleaf tree (the "oak" preset of the old workshop). */
export type TreeParams = {
	trunkH: number
	/** length the trunk's limbs are sized on: a taller trunk does not lengthen them */
	limbLen: number
	trunkW: number
	levels: number
	kids: number
	angle: number
	/** push on every fork toward -X (negative: the left of the screen), so the limbs lean away from the trunk */
	wind: number
	lenR: number
	radR: number
	curv: number
	twist: number
	droop: number
	irr: number
	density: number
	leafSize: number
	leafVar: number
	squash: number
	mix: number
	leafColor: string
	leafColor2: string
	barkColor: string
}

/**
 * One limb. `bends` holds a [twist, curve] pair (radians) per segment from the
 * second one on: the random draws are frozen, so a seed always gives one tree.
 */
export type Branch = {
	id: number
	parent: number | null
	at: number
	dir: Vec3
	axis: Vec3
	len: number
	rad: number
	level: number
	bends: [number, number][]
}

export type Skeleton = { grav: number; branches: Branch[] }

/** A traced limb: segment ends, and the direction of each segment. */
export type Path = { points: Vec3[]; dirs: Vec3[] }

/** The trunk's axis and radius at some height. */
export type TrunkSpot = { x: number; z: number; radius: number }
