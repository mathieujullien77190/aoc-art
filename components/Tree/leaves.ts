import {
	CircleGeometry,
	DoubleSide,
	Group,
	Mesh,
	MeshLambertMaterial,
	Vector3,
} from "three"

import { FALL, PARAMS, SEED } from "./constants"
import { shade } from "./color"
import { mulberry32 } from "./random"

type Leaf = {
	mesh: Mesh
	speed: number
	sway: number
	rate: number
	phase: number
	spin: Vector3
	/** where it let go, and how far it has fallen since */
	from: Vector3
	fell: number
}

const between = ([min, max]: number[], t: number) => min + (max - min) * t

/**
 * A few autumn leaves that come off the crown and drift down: each one lets go
 * of a random tip, sways and tumbles on the way, and starts again from another
 * tip once it passes the foot of the trunk. `tips` are in world space.
 */
export const createFallingLeaves = (tips: Vector3[]) => {
	const rng = mulberry32(SEED + 4242)
	const group = new Group()
	const geometry = new CircleGeometry(1, 4)

	const release = (leaf: Leaf) => {
		leaf.from.copy(tips[Math.floor(rng() * tips.length)])
		leaf.fell = 0
		leaf.phase = rng() * Math.PI * 2
	}

	const leaves: Leaf[] = Array.from({ length: FALL.count }, () => {
		const base = rng() < PARAMS.mix / 100 ? PARAMS.leafColor2 : PARAMS.leafColor
		const mesh = new Mesh(
			geometry,
			new MeshLambertMaterial({
				color: shade(base, (rng() - 0.5) * 0.2),
				side: DoubleSide,
			})
		)
		// a diamond, longer than wide
		const size = between(FALL.size, rng())
		mesh.scale.set(size * 0.7, size, size)
		group.add(mesh)

		const leaf: Leaf = {
			mesh,
			speed: between(FALL.speed, rng()),
			sway: between(FALL.sway, rng()),
			rate: 1 + rng() * 1.5,
			phase: 0,
			spin: new Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(3),
			from: new Vector3(),
			fell: 0,
		}
		release(leaf)
		// spread them along the fall so they do not all leave at once
		leaf.fell = rng() * Math.max(0, leaf.from.y - FALL.floor)
		return leaf
	})

	/** `time` and `dt` in seconds */
	const update = (time: number, dt: number) => {
		for (const leaf of leaves) {
			leaf.fell += leaf.speed * dt
			const y = leaf.from.y - leaf.fell
			if (y < FALL.floor) {
				release(leaf)
				continue
			}
			const wave = Math.sin(time * leaf.rate + leaf.phase)
			leaf.mesh.position.set(
				leaf.from.x + wave * leaf.sway + FALL.wind * (leaf.fell / leaf.speed),
				y,
				leaf.from.z + Math.cos(time * leaf.rate + leaf.phase) * leaf.sway
			)
			leaf.mesh.rotation.x += leaf.spin.x * dt
			leaf.mesh.rotation.y += leaf.spin.y * dt
			leaf.mesh.rotation.z += leaf.spin.z * dt
		}
	}

	return { group, update }
}
