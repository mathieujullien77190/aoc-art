import { Vec3 } from "./types"

export const UP: Vec3 = [0, 1, 0]

export const add = (a: Vec3, b: Vec3): Vec3 => [
	a[0] + b[0],
	a[1] + b[1],
	a[2] + b[2],
]

export const sub = (a: Vec3, b: Vec3): Vec3 => [
	a[0] - b[0],
	a[1] - b[1],
	a[2] - b[2],
]

export const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k]

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

export const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0],
]

export const normalize = (a: Vec3): Vec3 =>
	scale(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))

export const lerp = (a: Vec3, b: Vec3, t: number): Vec3 =>
	add(a, scale(sub(b, a), t))

/** Rotates `v` around the unit `axis` (Rodrigues' formula). */
export const rotate = (v: Vec3, axis: Vec3, angle: number): Vec3 => {
	const c = Math.cos(angle)
	const s = Math.sin(angle)
	const k = cross(axis, v)
	const d = dot(axis, v) * (1 - c)
	return [
		v[0] * c + k[0] * s + axis[0] * d,
		v[1] * c + k[1] * s + axis[1] * d,
		v[2] * c + k[2] * s + axis[2] * d,
	]
}

/** Any unit vector perpendicular to `d`. */
export const perpendicular = (d: Vec3): Vec3 =>
	normalize(cross(d, Math.abs(d[1]) < 0.9 ? UP : [1, 0, 0]))
