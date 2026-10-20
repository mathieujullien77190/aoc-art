import {
	CircleGeometry,
	CylinderGeometry,
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshLambertMaterial,
	Shape,
} from "three"

export const URL = "https://mathieujullien77190.github.io/birds/"

/** One unit of the old flat drawing, in world units. */
const K = 0.0028

/** Width of the house, back to front, and depth of its wall. */
const DEPTH = 44 * K

const wall = new MeshLambertMaterial({ color: "#ffffff", flatShading: true })
const oak = new MeshLambertMaterial({ color: "#b8854a", flatShading: true })
const dark = new MeshLambertMaterial({ color: "#2a2a2a" })

const slab = (points: [number, number][], depth: number, material: MeshLambertMaterial) => {
	const shape = new Shape()
	points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)))
	const g = new ExtrudeGeometry(shape, { depth, bevelEnabled: false })
	g.translate(0, 0, -depth / 2)
	return new Mesh(g, material)
}

/**
 * The birdhouse of the desktop, in 3D: a wall whose top slopes down toward the
 * front, under an oak roof that follows the slope and overhangs. The back is
 * the plane X = 0, flat against the trunk; the front points toward +X; the
 * floor is Y = 0. Same proportions as the flat drawing it replaces.
 */
export const buildBirdhouse = () => {
	const house = new Group()

	house.add(
		slab(
			[
				[0, 0],
				[36 * K, 0],
				[36 * K, 62 * K],
				[0, 82 * K],
			],
			DEPTH,
			wall
		)
	)
	house.add(
		slab(
			[
				[0, 82 * K],
				[44 * K, 58 * K],
				[44 * K, 65 * K],
				[0, 89 * K],
			],
			DEPTH + 10 * K,
			oak
		)
	)

	// the entrance on the front, and the perch under it
	const hole = new Mesh(new CircleGeometry(7 * K, 12), dark)
	hole.rotation.y = Math.PI / 2
	hole.position.set(36 * K + 0.0005, 34 * K, 0)
	house.add(hole)

	const perch = new Mesh(new CylinderGeometry(1.4 * K, 1.4 * K, 12 * K, 6), oak)
	perch.rotation.x = Math.PI / 2
	perch.position.set(40 * K, 20 * K, 0)
	house.add(perch)

	return house
}
