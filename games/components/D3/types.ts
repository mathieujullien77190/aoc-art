/** @format */

import { Size } from "_games/helpers/types"

import { Controls } from "../Controls"

export type AxesValue = { H: number; V: number }

export type D3Props = {
	size: Size
	start?: AxesValue
	set?: AxesValue & { i: number }
	children: JSX.Element
	zoom?: {
		value: number
		min: number
		max: number
		step: number
		bigStep: number
	}
	zoomMax?: number
	margin?: number
	originZ?: number
	control?: {
		mouse: {
			activate: boolean
			smoothing: number
			speed: number
		}
		keyboard?: boolean
		UI?: boolean
	}
	addControl?: Controls[]

	onControlChange?: (name, value) => void
}
