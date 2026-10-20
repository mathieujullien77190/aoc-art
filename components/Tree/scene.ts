import {
	DirectionalLight,
	HemisphereLight,
	Mesh,
	Object3D,
	PerspectiveCamera,
	Raycaster,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer,
} from "three"

import { URL, buildBirdhouse } from "../Birdhouse"

import {
	CAMERA,
	CLICK_SLOP,
	FOOT_BLEED,
	HOUSE_SEGMENT,
	HOUSE_SINK,
	PARAMS,
} from "./constants"
import { createFallingLeaves } from "./leaves"
import { buildTree } from "./mesh"

/**
 * The desktop's tree in 3D, with the birdhouse hung on its trunk, drawn on a
 * transparent canvas, from a fixed view. Nothing moves it; a click on the
 * birdhouse opens its site. Returns the function that tears it all down.
 */
export const createGarden = (canvas: HTMLCanvasElement) => {
	const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	const scene = new Scene()
	const camera = new PerspectiveCamera(CAMERA.fov, 1, 0.1, 50)
	camera.position.set(...CAMERA.position)

	scene.add(new HemisphereLight(0xffffff, 0x6b7f4a, 2.2))
	const sun = new DirectionalLight(0xffffff, 2.2)
	sun.position.set(3, 5, 4)
	scene.add(sun)

	// the trunk rises straight; the limbs lean to the left on their own
	const { group: tree, trunkAt, segmentY, tips } = buildTree()
	scene.add(tree)
	tree.updateMatrixWorld()

	// the birdhouse: floor at the start of the trunk's third segment, back
	// against the trunk's left face, front toward -X
	const house = buildBirdhouse()
	const floor = segmentY(HOUSE_SEGMENT)
	const spot = trunkAt(floor)
	house.rotation.y = Math.PI
	house.position.set(spot.x - spot.radius + HOUSE_SINK, floor, spot.z)
	scene.add(house)

	// autumn leaves falling from the crown
	const leaves = createFallingLeaves(tips)
	scene.add(leaves.group)

	const render = () => renderer.render(scene, camera)

	camera.lookAt(...CAMERA.target)

	// the trunk is glued to the right edge of the screen: the view is shifted, not
	// the scene, until the trunk's right-most point lands on the edge
	const resize = () => {
		const w = window.innerWidth
		const h = window.innerHeight
		renderer.setSize(w, h, false)
		camera.aspect = w / h
		camera.clearViewOffset()
		camera.updateMatrixWorld()

		let edge = -Infinity
		for (let y = 0; y <= PARAMS.trunkH; y += PARAMS.trunkH / 8) {
			const spot = trunkAt(y)
			const p = new Vector3(spot.x + spot.radius, y, spot.z)
				.applyMatrix4(tree.matrixWorld)
				.project(camera)
			edge = Math.max(edge, ((p.x + 1) / 2) * w)
		}

		// and its foot below the bottom edge, so the trunk starts at the screen's bottom
		const foot = new Vector3().applyMatrix4(tree.matrixWorld).project(camera)
		const footY = ((1 - foot.y) / 2) * h

		camera.setViewOffset(w, h, edge - w, footY - h - FOOT_BLEED, w, h)
		camera.updateProjectionMatrix()
		render()
	}
	resize()
	window.addEventListener("resize", resize)

	// the leaves fall; a visitor who asks for less motion gets a still tree
	let frame = 0
	let last = performance.now()
	const tick = (now: number) => {
		leaves.update(now / 1000, Math.min((now - last) / 1000, 0.1))
		last = now
		render()
		frame = requestAnimationFrame(tick)
	}
	if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		frame = requestAnimationFrame(tick)
	}

	// the birdhouse is the only thing the left button reaches
	const ray = new Raycaster()
	const pointer = new Vector2()
	const onHouse = (e: PointerEvent) => {
		const box = canvas.getBoundingClientRect()
		pointer.set(
			((e.clientX - box.left) / box.width) * 2 - 1,
			-((e.clientY - box.top) / box.height) * 2 + 1
		)
		ray.setFromCamera(pointer, camera)
		return ray.intersectObject(house, true).length > 0
	}

	let down: Vector2 | null = null
	const onDown = (e: PointerEvent) => {
		down = e.button === 0 ? new Vector2(e.clientX, e.clientY) : null
	}
	const onUp = (e: PointerEvent) => {
		const moved = down && down.distanceTo(new Vector2(e.clientX, e.clientY))
		down = null
		if (e.button === 0 && moved !== null && moved < CLICK_SLOP && onHouse(e)) {
			window.open(URL, "_blank", "noopener,noreferrer")
		}
	}
	const onMove = (e: PointerEvent) => {
		canvas.style.cursor = e.buttons === 0 && onHouse(e) ? "pointer" : ""
	}
	canvas.addEventListener("pointerdown", onDown)
	canvas.addEventListener("pointerup", onUp)
	canvas.addEventListener("pointermove", onMove)

	return () => {
		canvas.removeEventListener("pointerdown", onDown)
		canvas.removeEventListener("pointerup", onUp)
		canvas.removeEventListener("pointermove", onMove)
		window.removeEventListener("resize", resize)
		cancelAnimationFrame(frame)
		scene.traverse((object: Object3D) => {
			const mesh = object as Mesh
			mesh.geometry?.dispose()
			;[mesh.material].flat().forEach(m => m?.dispose())
		})
		renderer.dispose()
	}
}
