import {
	BufferAttribute,
	BufferGeometry,
	Color,
	CylinderGeometry,
	Group,
	IcosahedronGeometry,
	Mesh,
	MeshLambertMaterial,
	Quaternion,
	Vector3,
} from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

import { PARAMS, SEED, TAPER } from "./constants"
import { genSkeleton, tracePaths } from "./skeleton"
import { shade } from "./color"
import { clamp, mulberry32 } from "./random"
import { TrunkSpot, Vec3 } from "./types"

const UP = new Vector3(0, 1, 0)

/** Sides of a limb's prism, by level: the trunk is rounder than the twigs. */
const sidesOf = (level: number) => (level === 0 ? 12 : level < 3 ? 9 : 6)

/** Flat-shaded and unindexed, so each face keeps its own colour. */
const flat = (g: BufferGeometry) => (g.index ? g.toNonIndexed() : g)

const paint = (g: BufferGeometry, color: Color) => {
	const count = g.attributes.position.count
	const colors = new Float32Array(count * 3)
	for (let i = 0; i < count; i++) {
		colors[i * 3] = color.r
		colors[i * 3 + 1] = color.g
		colors[i * 3 + 2] = color.b
	}
	g.setAttribute("color", new BufferAttribute(colors, 3))
	return g
}

const material = () =>
	new MeshLambertMaterial({ vertexColors: true, flatShading: true })

/**
 * The tree of the old workshop, in 3D: one mesh for all the limbs, one for all
 * the leaf tufts, merged so the whole tree is two draw calls. The foot of the
 * trunk is at the origin, the trunk rises along +Y.
 */
export const buildTree = () => {
	const sk = genSkeleton(PARAMS, SEED)
	const paths = tracePaths(sk)

	// limbs: one tapered prism per segment
	const limbs: BufferGeometry[] = []
	for (const b of sk.branches) {
		const { points, dirs } = paths.get(b.id)
		const n = b.bends.length + 1
		const len = b.len / n
		const rng = mulberry32(SEED * 7919 + b.id)
		for (let s = 0; s < n; s++) {
			const d = new Vector3(...dirs[s])
			const g = new CylinderGeometry(
				b.rad * (1 - (TAPER * (s + 1)) / n),
				b.rad * (1 - (TAPER * s) / n),
				len,
				sidesOf(b.level),
				1
			)
			g.applyQuaternion(new Quaternion().setFromUnitVectors(UP, d))
			g.translate(
				points[s][0] + (d.x * len) / 2,
				points[s][1] + (d.y * len) / 2,
				points[s][2] + (d.z * len) / 2
			)
			limbs.push(
				paint(flat(g), shade(PARAMS.barkColor, b.level * 0.04 + (rng() - 0.5) * 0.05))
			)
		}
	}

	// foliage: tufts at the tip of every limb that carries no other
	const parents = new Set(sk.branches.map(b => b.parent))
	const tips = sk.branches
		.filter(b => !parents.has(b.id))
		.map(b => ({ id: b.id, p: paths.get(b.id).points.at(-1) }))
	const yLo = Math.min(...tips.map(t => t.p[1]))
	const yHi = Math.max(...tips.map(t => t.p[1]))
	const prob = clamp(PARAMS.density / 100, 0, 1)

	const tufts: BufferGeometry[] = []
	for (const tip of tips) {
		const rng = mulberry32(SEED * 1000 + tip.id)
		if (rng() > prob) continue
		const count = 2 + (PARAMS.density > 55 ? 1 : 0) + (rng() < 0.5 ? 1 : 0)
		const light = clamp((tip.p[1] - yLo) / Math.max(0.01, yHi - yLo), 0, 1)
		const reach = PARAMS.leafSize * 0.8

		for (let i = 0; i < count; i++) {
			const size =
				PARAMS.leafSize * (1 + (rng() - 0.5) * 2 * PARAMS.leafVar * 0.8) * 0.75
			const g = new IcosahedronGeometry(1, 2)
			g.rotateX(rng() * Math.PI * 2)
			g.rotateY(rng() * Math.PI * 2)
			g.scale(size, size * PARAMS.squash, size)
			g.translate(
				tip.p[0] + (rng() - 0.5) * 2 * reach,
				tip.p[1] + (rng() - 0.5) * 2 * reach,
				tip.p[2] + (rng() - 0.5) * 2 * reach
			)
			const base = rng() < PARAMS.mix / 100 ? PARAMS.leafColor2 : PARAMS.leafColor
			tufts.push(paint(flat(g), shade(base, light * 0.24 - 0.12 + (rng() - 0.5) * 0.07)))
		}
	}

	const group = new Group()
	for (const parts of [limbs, tufts]) {
		const geometry = mergeGeometries(parts)
		parts.forEach(g => g.dispose())
		group.add(new Mesh(geometry, material()))
	}

	// the trunk's axis and radius at a height, to hang something on it
	const trunk = paths.get(0).points
	const trunkAt = (y: number): TrunkSpot => {
		let i = 0
		while (i < trunk.length - 2 && trunk[i + 1][1] < y) i++
		const a: Vec3 = trunk[i]
		const e: Vec3 = trunk[i + 1]
		const t = clamp((y - a[1]) / (e[1] - a[1] || 1), 0, 1)
		const n = trunk.length - 1
		return {
			x: a[0] + (e[0] - a[0]) * t,
			z: a[2] + (e[2] - a[2]) * t,
			radius: sk.branches[0].rad * (1 - (TAPER * (i + t)) / n),
		}
	}

	/** height where the n-th segment of the trunk (1-based) starts */
	const segmentY = (n: number) => trunk[n - 1][1]

	return { group, trunkAt, segmentY, tips: tips.map(tip => new Vector3(...tip.p)) }
}
