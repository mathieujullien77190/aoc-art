import { TRUNK_SEGMENTS } from "./constants"
import { Branch, Path, Skeleton, TreeParams, Vec3 } from "./types"
import { clamp, mulberry32 } from "./random"
import {
	UP,
	add,
	dot,
	lerp,
	normalize,
	perpendicular,
	rotate,
	scale,
	sub,
} from "./vec3"

const round4 = (v: number) => Math.round(v * 1e4) / 1e4
const roundVec = (v: Vec3): Vec3 => [round4(v[0]), round4(v[1]), round4(v[2])]

/** Sides of a limb's cylinder in the old 3D mesh: only used to burn the same draws. */
const sidesOf = (level: number) => (level === 0 ? 7 : level < 3 ? 6 : 5)

/** Point at fraction `at` of a polyline made of equal segments. */
export const pathPoint = (points: Vec3[], at: number): Vec3 => {
	const n = points.length - 1
	const x = clamp(at, 0, 1) * n
	const i = Math.min(n - 1, Math.floor(x))
	return lerp(points[i], points[i + 1], x - i)
}

/** Walks a limb from `origin`: the axis twists, the direction curves and sags. */
export const tracePath = (b: Branch, origin: Vec3, grav: number): Path => {
	const n = b.bends.length + 1
	const segLen = b.len / n
	let dir = normalize(b.dir)
	let axis = b.axis
	let p = origin
	const points = [p]
	const dirs: Vec3[] = []

	for (let s = 0; s < n; s++) {
		if (s > 0) {
			axis = normalize(sub(axis, scale(dir, dot(axis, dir))))
			axis = rotate(axis, dir, b.bends[s - 1][0])
			dir = rotate(dir, axis, b.bends[s - 1][1])
			dir = normalize([dir[0], dir[1] - grav, dir[2]])
		}
		dirs.push(dir)
		p = add(p, scale(dir, segLen))
		points.push(p)
	}

	return { points, dirs }
}

/** Traces every limb: a child starts where it leaves its parent. */
export const tracePaths = (sk: Skeleton) => {
	const paths = new Map<number, Path>()
	for (const b of sk.branches) {
		const parent = b.parent === null ? null : paths.get(b.parent)
		const origin: Vec3 = parent ? pathPoint(parent.points, b.at) : [0, 0, 0]
		paths.set(b.id, tracePath(b, origin, sk.grav))
	}
	return paths
}

/**
 * Draws the tree's limbs: a trunk that forks, each fork shorter and thinner.
 * Ported from the old workshop's generator, draw for draw, so a seed gives the
 * very tree the workshop showed.
 */
export const genSkeleton = (q: TreeParams, seed: number): Skeleton => {
	const rng = mulberry32(seed)
	const sk: Skeleton = { grav: round4(q.droop * 0.14), branches: [] }
	const paths = new Map<number, Path>()
	const spread = (q.angle * Math.PI) / 180

	const grow = (
		parent: number | null,
		at: number,
		dir0: Vec3,
		len: number,
		rad: number,
		level: number
	) => {
		const segments = level === 0 ? TRUNK_SEGMENTS : 3
		const dir = normalize(dir0)
		const b: Branch = {
			id: sk.branches.length,
			parent,
			at: round4(at),
			dir: roundVec(dir),
			axis: roundVec(perpendicular(dir)),
			len: round4(len),
			rad: round4(rad),
			level,
			bends: [],
		}
		sk.branches.push(b)

		for (let s = 0; s < segments; s++) {
			if (s > 0) {
				const twist = q.twist * 1.1 + (rng() - 0.5) * q.irr
				const curve = q.curv * 0.32 * (1 + (rng() - 0.5) * q.irr * 1.6)
				// the trunk rises straight: its draws are spent, its bends are not
				b.bends.push(level === 0 ? [0, 0] : [round4(twist), round4(curve)])
			}
			// the old mesh drew trunk relief and one colour per face here
			for (let k = (level === 0 ? 1 : 0) + 4 * sidesOf(level); k > 0; k--) rng()
		}

		const from = parent === null ? null : paths.get(parent)
		const origin: Vec3 = from ? pathPoint(from.points, b.at) : [0, 0, 0]
		const path = tracePath(b, origin, sk.grav)
		paths.set(b.id, path)
		if (level >= q.levels) return

		// a fork: `count` children around the limb's axis
		const spawn = (
			atK: number,
			dd: Vec3,
			count: number,
			angK: number,
			lenMul: number
		) => {
			const base = perpendicular(dd)
			for (let i = 0; i < count; i++) {
				const phi =
					(i / count) * Math.PI * 2 + level * 0.9 + (rng() - 0.5) * q.irr * 2.2
				const a = rotate(base, dd, phi)
				const child = rotate(dd, a, angK * (0.75 + rng() * 0.5))
				child[0] += q.wind
				child[1] += 0.12
				grow(
					b.id,
					atK,
					normalize(child),
					ref * q.lenR * lenMul * (0.85 + rng() * 0.3),
					rad * q.radR,
					level + 1
				)
			}
		}

		// the first limbs are sized on `limbLen`, not on the trunk: a taller trunk keeps the same crown
		const ref = level === 0 ? q.limbLen : len
		const last = path.dirs[segments - 1]
		spawn(1, last, q.kids, q.kids === 1 ? spread * 0.5 : spread, 1)
		// side limbs lower down the trunk and the big limbs
		if (level <= 1) {
			spawn((segments - 1) / segments, last, level === 0 ? 2 : 1, spread * 1.25, 0.8)
		}
	}

	grow(null, 0, UP, q.trunkH, q.trunkW / 2, 0)
	return sk
}
