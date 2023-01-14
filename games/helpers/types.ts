/** @format */

export type Position = { x: number; y: number }

export type Position3D = Position & { z: number }

export type Size = { width: number; height: number }

export type View = { width?: number; height?: number; value: string }

export type ViewPlan = { width?: number; height?: number; value: string[] }

export type Matrix = string[][]

export type Boundary = {
	xMin: number
	xMax: number
	yMin: number
	yMax: number
}

export type Boundary3D = {
	xMin: number
	xMax: number
	yMin: number
	yMax: number
	zMin: number
	zMax: number
}

export type MinMax = { min: number; max: number }
