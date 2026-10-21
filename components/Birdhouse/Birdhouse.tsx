import {
	BoxGeometry,
	CatmullRomCurve3,
	CircleGeometry,
	Color,
	ConeGeometry,
	CylinderGeometry,
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshBasicMaterial,
	MeshLambertMaterial,
	Shape,
	SphereGeometry,
	TorusGeometry,
	TubeGeometry,
	Vector3,
} from "three"

export const URL = "https://mathieujullien77190.github.io/birds/"

/** One unit of the old flat drawing, in world units. */
const K = 0.0035

/** Width of the house, back to front, and depth of its wall. */
const DEPTH = 44 * K

const wall = new MeshLambertMaterial({ color: "#ffffff", flatShading: true })
const oak = new MeshLambertMaterial({ color: "#b8854a", flatShading: true })
const dark = new MeshLambertMaterial({ color: "#2a2a2a" })
const steel = new MeshLambertMaterial({ color: "#9aa1ab", flatShading: true })
const plastic = new MeshLambertMaterial({ color: "#1b1b20", flatShading: true })
const panel = new MeshLambertMaterial({ color: "#16357a", flatShading: true })
const rubber = [
	new MeshLambertMaterial({ color: "#111111" }),
	new MeshLambertMaterial({ color: "#c0302a" }),
	new MeshLambertMaterial({ color: "#d8b020" }),
	new MeshLambertMaterial({ color: "#2a6fd0" }),
]

type Material = MeshLambertMaterial | MeshBasicMaterial

const slab = (points: [number, number][], depth: number, material: MeshLambertMaterial) => {
	const shape = new Shape()
	points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)))
	const g = new ExtrudeGeometry(shape, { depth, bevelEnabled: false })
	g.translate(0, 0, -depth / 2)
	return new Mesh(g, material)
}

const box = (w: number, h: number, d: number, material: Material) =>
	new Mesh(new BoxGeometry(w, h, d), material)

/**
 * Curls `count` loops into a path, on its longest segments, each bulging away
 * from the trunk (toward +X) so it does not sink into the bark.
 */
const curl = (path: Vector3[], count: number) => {
	const order = path
		.slice(0, -1)
		.map((p, i) => ({ i, len: p.distanceTo(path[i + 1]) }))
		.sort((a, b) => b.len - a.len)
		.slice(0, count)
		.map(s => s.i)
	const out: Vector3[] = []
	path.forEach((p, i) => {
		out.push(p)
		if (!order.includes(i)) return
		const next = path[i + 1]
		const dir = next.clone().sub(p)
		const len = dir.length()
		dir.normalize()
		const up = new Vector3(1, 0, 0)
		up.sub(dir.clone().multiplyScalar(dir.dot(up)))
		if (up.length() < 0.3) up.set(0, 0, 1).sub(dir.clone().multiplyScalar(dir.z))
		up.normalize()
		const R = Math.min(0.018, len * 0.16)
		const start = p.clone().lerp(next, 0.35)
		for (let n = 0; n <= 16; n++) {
			const t = (n / 16) * Math.PI * 2
			out.push(
				start
					.clone()
					.addScaledVector(dir, R * 0.55 * t + R * Math.sin(t))
					.addScaledVector(up, R * (1 - Math.cos(t)))
			)
		}
	})
	return out
}

/** A cable through the points, with a loop or two curled into it. */
const cable = (
	points: [number, number, number][],
	i: number,
	r = 1.1 * K,
	loops = 1 + (points.length % 2)
) =>
	new Mesh(
		new TubeGeometry(
			new CatmullRomCurve3(curl(points.map(p => new Vector3(...p)), loops)),
			160,
			r,
			5
		),
		rubber[i % rubber.length]
	)

/** A cable hanging between two points, sagging by `drop` in the middle. */
const swag = (
	a: [number, number, number],
	b: [number, number, number],
	drop: number,
	i: number,
	r = 1 * K
) => {
	const points: [number, number, number][] = []
	for (let n = 0; n <= 8; n++) {
		const t = n / 8
		points.push([
			a[0] + (b[0] - a[0]) * t,
			a[1] + (b[1] - a[1]) * t - drop * 4 * t * (1 - t),
			a[2] + (b[2] - a[2]) * t,
		])
	}
	return cable(points, i, r)
}

/** A cable wound into a coil of `turns` loops, in the plane of X and Y, along Z. */
const coil = (
	center: [number, number, number],
	radius: number,
	turns: number,
	length: number,
	i: number,
	r = 1 * K
) => {
	const points: [number, number, number][] = []
	const steps = Math.round(turns * 14)
	for (let n = 0; n <= steps; n++) {
		const t = n / steps
		const angle = t * turns * Math.PI * 2
		points.push([
			center[0] + Math.cos(angle) * radius,
			center[1] + Math.sin(angle) * radius,
			center[2] + (t - 0.5) * length,
		])
	}
	return cable(points, i, r, 0)
}

/** The plug at the loose end of a hanging cable. */
const plug = (x: number, y: number, z: number, i: number) => {
	const m = box(2.6 * K, 4 * K, 2.6 * K, plastic)
	m.position.set(x, y, z)
	const tip = box(1.6 * K, 1.6 * K, 1.6 * K, i % 2 ? steel : rubber[2])
	tip.position.set(x, y - 2.6 * K, z)
	const g = new Group()
	g.add(m, tip)
	return g
}

/**
 * The birdhouse of the desktop, in 3D: a wall whose top slopes down toward the
 * front, under an oak roof that follows the slope and overhangs. The back is
 * the plane X = 0, flat against the trunk; the front points toward +X; the
 * floor is Y = 0. Same proportions as the flat drawing it replaces.
 *
 * It is a high-tech one: a dish, a mast, a solar roof, two cameras, a neon
 * entrance, a status panel, a fan and cables running up and down the trunk.
 * `trunkSurface(y)` gives how far (local X) the bark stands from the back
 * plane at a height above the floor, so the cables hug it. `update(t)` blinks
 * the lights and turns the cameras, the dish and the fan.
 */
export const buildBirdhouse = (trunkSurface: (y: number) => number = () => 0) => {
	const house = new Group()

	// a point on the trunk's bark, `out` away from it
	const bark = (y: number, z: number, out = 0.004): [number, number, number] => [
		trunkSurface(y) + out,
		y,
		z,
	]

	// lights that flip between two colors at a rate (flips per second)
	const blinkers: { mesh: Mesh; colors: [string, string]; rate: number; phase: number }[] = []
	const led = (
		parent: Group,
		colors: [string, string],
		position: [number, number, number],
		rate: number,
		phase = 0,
		size = 2.2 * K
	) => {
		const mesh = box(size, size, size, new MeshBasicMaterial({ color: colors[0] }))
		mesh.position.set(...position)
		parent.add(mesh)
		blinkers.push({ mesh, colors, rate, phase })
		return mesh
	}

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

	// neon ring around the entrance
	const ring = new Mesh(
		new TorusGeometry(9 * K, 0.9 * K, 6, 24),
		new MeshBasicMaterial({ color: "#19e6ff" })
	)
	ring.rotation.y = Math.PI / 2
	ring.position.set(36 * K + 0.001, 34 * K, 0)
	house.add(ring)

	// roof: solar panel on the slope, dish at the back, mast with its beacon
	const slope = Math.atan(24 / 44)
	const roofY = (x: number) => (89 - (24 * x) / 44) * K
	const solar = box(22 * K, 1.4 * K, 32 * K, panel)
	solar.position.set(30 * K, roofY(30 * K) + 1.2 * K, 0)
	solar.rotation.z = -slope
	house.add(solar)
	for (const z of [-5, 5]) {
		const bar = box(21 * K, 0.4 * K, 0.5 * K, steel)
		bar.position.set(30 * K, roofY(30 * K) + 2 * K, z * K)
		bar.rotation.z = -slope
		house.add(bar)
	}

	const dish = new Group()
	const pole = new Mesh(new CylinderGeometry(0.9 * K, 0.9 * K, 12 * K, 6), steel)
	pole.position.y = 6 * K
	const bowl = new Mesh(new SphereGeometry(9 * K, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2.4), steel)
	bowl.rotation.x = Math.PI
	bowl.position.y = 14 * K
	const feed = new Mesh(new CylinderGeometry(0.5 * K, 0.5 * K, 7 * K, 4), steel)
	feed.position.y = 17.5 * K
	const lnb = new Mesh(new SphereGeometry(1.2 * K, 6, 4), plastic)
	lnb.position.y = 21 * K
	dish.add(pole, bowl, feed, lnb)
	dish.position.set(9 * K, roofY(9 * K), 20 * K)
	dish.rotation.set(-0.5, 0, 0.6)
	house.add(dish)

	const mast = new Group()
	const stem = new Mesh(new CylinderGeometry(0.6 * K, 0.9 * K, 34 * K, 6), steel)
	stem.position.y = 17 * K
	mast.add(stem)
	for (const [h, w] of [
		[12, 16],
		[20, 12],
		[27, 8],
	]) {
		const arm = box(1.2 * K, 0.6 * K, w * K, steel)
		arm.position.y = h * K
		mast.add(arm)
	}
	led(mast, ["#ff2a2a", "#3a0505"], [0, 35 * K, 0], 0.9, 0, 3.4 * K)
	mast.position.set(6 * K, roofY(6 * K), -19 * K)
	house.add(mast)

	// a router lying on the roof, antennas up
	const router = new Group()
	const shell = box(14 * K, 3 * K, 9 * K, plastic)
	shell.position.y = 1.5 * K
	router.add(shell)
	for (const z of [-3.5, 3.5]) {
		const antenna = new Mesh(new CylinderGeometry(0.5 * K, 0.5 * K, 14 * K, 5), plastic)
		antenna.position.set(-4 * K, 10 * K, z * K)
		antenna.rotation.z = 0.25
		router.add(antenna)
	}
	for (let i = 0; i < 3; i++) {
		led(router, ["#35ff6a", "#0b3a18"], [(4 + i * 4 - 6) * K, 3.4 * K, 3.6 * K], 3 + i * 1.7, i, 1.3 * K)
	}
	router.position.set(19 * K, roofY(19 * K) + 4 * K, -28 * K)
	router.rotation.z = -slope
	house.add(router)

	// two security cameras at the front corners, each on its bracket
	const cameras: Group[] = []
	for (const [z, phase] of [
		[17, 0],
		[-17, Math.PI],
	]) {
		const cam = new Group()
		const arm = box(7 * K, 1.4 * K, 1.8 * K, steel)
		arm.position.x = 1 * K
		const head = new Group()
		const body = new Mesh(new CylinderGeometry(2.6 * K, 2.6 * K, 11 * K, 10), plastic)
		body.rotation.z = Math.PI / 2
		body.position.x = 5 * K
		const hood = box(12 * K, 0.8 * K, 5.6 * K, plastic)
		hood.position.set(5.5 * K, 2.9 * K, 0)
		const lens = new Mesh(new CircleGeometry(2 * K, 10), new MeshBasicMaterial({ color: "#4a8bff" }))
		lens.rotation.y = Math.PI / 2
		lens.position.x = 10.6 * K
		head.add(body, hood, lens)
		led(head, ["#ff3030", "#240808"], [10 * K, -2.2 * K, 2 * K], 1.6, phase, 1 * K)
		head.position.set(5 * K, -1.5 * K, 0)
		head.rotation.z = -0.25
		cam.add(arm, head)
		cam.position.set(36 * K, 54 * K, z * K)
		cam.userData.phase = phase
		house.add(cam)
		cameras.push(cam)
	}

	// status panel under the entrance: a row of LEDs, a keypad, a speaker grille
	const status = box(1.2 * K, 7 * K, 28 * K, plastic)
	status.position.set(36 * K + 0.6 * K, 9 * K, 0)
	house.add(status)
	;["#35ff6a", "#ffb020", "#ff3030", "#19e6ff", "#35ff6a", "#c040ff"].forEach((c, i) => {
		led(house, [c, "#101010"], [36 * K + 1.6 * K, 11 * K, (-11 + i * 4.4) * K], 1.1 + i * 0.9, i * 0.7, 1.8 * K)
	})
	for (let i = 0; i < 6; i++) {
		const key = box(0.5 * K, 1.6 * K, 2 * K, steel)
		key.position.set(36 * K + 1.4 * K, 7 * K - (i % 2) * 2.2 * K, (-11 + (i >> 1) * 5) * K)
		house.add(key)
	}
	for (let i = 0; i < 4; i++) {
		const slit = box(0.4 * K, 0.5 * K, 7 * K, dark)
		slit.position.set(36 * K + 1.3 * K, 4.4 * K - i * K, 8 * K)
		house.add(slit)
	}

	// a cooling fan on the side wall, spinning behind its housing
	const fan = new Group()
	const housing = new Mesh(new CylinderGeometry(7 * K, 7 * K, 2 * K, 16), plastic)
	housing.rotation.x = Math.PI / 2
	const rotor = new Group()
	for (let i = 0; i < 5; i++) {
		const blade = box(5.6 * K, 0.5 * K, 2 * K, steel)
		blade.position.x = 2.8 * K
		blade.rotation.x = 0.5
		const spoke = new Group()
		spoke.add(blade)
		spoke.rotation.z = (i * Math.PI * 2) / 5
		rotor.add(spoke)
	}
	rotor.position.z = 1.2 * K
	fan.add(housing, rotor)
	fan.position.set(18 * K, 28 * K, DEPTH / 2 + 1 * K)
	house.add(fan)

	// the far wall carries a little rack, three units with their LEDs, and a battery
	const rack = new Group()
	for (let i = 0; i < 3; i++) {
		const unit = box(12 * K, 3.6 * K, 2.4 * K, i === 1 ? steel : plastic)
		unit.position.y = i * 4.4 * K
		rack.add(unit)
		led(rack, ["#35ff6a", "#0b3a18"], [4 * K, i * 4.4 * K, -1.6 * K], 5 + i * 2.3, i * 0.4, 1.2 * K)
	}
	rack.position.set(18 * K, 16 * K, -DEPTH / 2 - 1.2 * K)
	house.add(rack)
	const battery = box(10 * K, 7 * K, 3 * K, steel)
	battery.position.set(18 * K, 44 * K, -DEPTH / 2 - 1.5 * K)
	house.add(battery)

	// cables: bundles climbing the trunk to a relay, others going down to the
	// power box, and loops hanging from the cameras
	const mastFoot: [number, number, number] = [6 * K, roofY(6 * K), -19 * K]
	const dishFoot: [number, number, number] = [9 * K, roofY(9 * K), 20 * K]
	house.add(
		cable([mastFoot, [0.004, 0.3, -0.045], bark(0.36, -0.03), bark(0.45, -0.02), bark(0.56, -0.015)], 0),
		cable([mastFoot, [0.004, 0.3, -0.04], bark(0.34, -0.025), bark(0.44, -0.012), bark(0.56, -0.005)], 1, 0.95 * K),
		cable([dishFoot, [0.006, 0.3, 0.05], bark(0.34, 0.03), bark(0.46, 0.02), bark(0.56, 0.01)], 2, 0.95 * K),
		cable([[0.003, 0.02, -0.02], bark(-0.1, -0.02), bark(-0.3, -0.015), bark(-0.5, -0.02), bark(-0.7, -0.02)], 0),
		cable([[0.003, 0.02, 0.02], bark(-0.1, 0.02), bark(-0.3, 0.015), bark(-0.5, 0.02), bark(-0.7, 0.02)], 3, 0.95 * K),
		cable([[36 * K, 50 * K, 17 * K], [0.06, 0.1, 0.07], [0.02, 0.0, 0.03], bark(-0.12, 0.02, 0.01)], 0, 0.9 * K),
		cable([[36 * K, 50 * K, -17 * K], [0.07, 0.12, -0.07], [0.03, 0.0, -0.03], bark(-0.14, -0.02, 0.01)], 1, 0.9 * K),
		cable([[0.001, 0.2, -0.05], [-0.002, 0.22, 0], [0.001, 0.2, 0.05]], 2, 0.9 * K)
	)

	// loops and swags: cables strung from the roof to the mast, the dish and the
	// camera brackets, a spare length coiled on each side, and plugs left dangling
	house.add(
		swag(mastFoot, [36 * K, 56 * K, -17 * K], 0.06, 1),
		swag(dishFoot, [36 * K, 56 * K, 17 * K], 0.07, 2),
		swag([36 * K, 54 * K, -17 * K], [36 * K, 54 * K, 17 * K], 0.05, 0),
		swag([36 * K + 2 * K, 12 * K, -14 * K], [36 * K + 2 * K, 12 * K, 14 * K], 0.07, 3, 0.8 * K),
		swag([18 * K, 16 * K, -DEPTH / 2 - 1 * K], [24 * K, 44 * K, -DEPTH / 2 - 1.5 * K], 0.05, 1, 0.8 * K),
		coil([30 * K, 40 * K, DEPTH / 2 + 5 * K], 6 * K, 3, 8 * K, 0, 1 * K),
		coil([30 * K, 14 * K, -DEPTH / 2 - 5 * K], 5 * K, 3, 7 * K, 3, 0.9 * K)
	)

	const hanging: [number, number, number, number, number][] = [
		// x, z at the roof edge, hang length, sway, cable color
		[10 * K, 28.5 * K, 0.22, 0.03, 0],
		[26 * K, 28.5 * K, 0.34, -0.02, 1],
		[36 * K, 28.5 * K, 0.18, 0.04, 2],
		[16 * K, -28.5 * K, 0.28, -0.03, 3],
		[32 * K, -28.5 * K, 0.2, 0.02, 0],
		[40 * K, 18 * K, 0.3, 0.05, 3],
	]
	hanging.forEach(([x, z, len, sway, i]) => {
		const top = roofY(x) - 3 * K
		const end: [number, number, number] = [x + sway, top - len, z + sway]
		house.add(
			cable(
				[
					[x, top, z],
					[x + sway * 0.1, top - len * 0.25, z + sway * 0.2],
					[x + sway * 0.6, top - len * 0.6, z + sway * 0.7],
					end,
				],
				i,
				0.9 * K
			)
		)
		const p = plug(end[0], end[1] - 1.5 * K, end[2], i)
		house.add(p)
	})

	// the relay up the trunk and the power box at its foot, each with its light
	const relay = new Group()
	relay.add(box(12 * K, 8 * K, 12 * K, steel))
	const horn = new Mesh(new ConeGeometry(4 * K, 5 * K, 8, 1, true), plastic)
	horn.position.y = 6 * K
	relay.add(horn)
	led(relay, ["#ffb020", "#201000"], [6.2 * K, 2 * K, 0], 2.1, 0, 2 * K)
	relay.position.set(trunkSurface(0.6) + 5 * K, 0.6, 0)
	house.add(relay)

	const power = new Group()
	power.add(box(18 * K, 14 * K, 18 * K, steel))
	for (let i = 0; i < 3; i++) {
		const vent = box(0.5 * K, 0.8 * K, 12 * K, dark)
		vent.position.set(9.2 * K, (2 - i * 2.4) * K, 0)
		power.add(vent)
	}
	led(power, ["#35ff6a", "#0b3a18"], [9.4 * K, 5 * K, 5 * K], 0.5, 0, 2 * K)
	power.position.set(trunkSurface(-0.75) + 9 * K, -0.75, 0)
	house.add(power)

	const tint = new Color()
	const update = (t: number) => {
		for (const b of blinkers) {
			const on = Math.floor(t * b.rate + b.phase) % 2 === 0
			;(b.mesh.material as MeshBasicMaterial).color.copy(tint.set(b.colors[on ? 0 : 1]))
		}
		for (const cam of cameras) cam.rotation.y = Math.sin(t * 0.7 + cam.userData.phase) * 0.55
		dish.rotation.y = Math.sin(t * 0.25) * 0.6
		rotor.rotation.z = t * 14
	}

	return { house, update }
}
