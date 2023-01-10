/** @format */

import { useState, useCallback, useEffect, useRef } from "react"
import { D3Props } from "./types"

import { isMobile } from "react-device-detect"
import * as S from "./UI"

import { useOrientation } from "./hooks"

import Controller from "../Controls"

let timer = null

export const D3 = ({
	size,
	margin = 0,
	zoom = { value: 10, min: 1, max: 20, step: 1, bigStep: 2 },
	set = { H: 0, V: 0, i: 0 },
	start = { H: 0, V: 0 },
	control = {
		mouse: { activate: true, smoothing: 400, speed: 2 },
		keyboard: true,
		UI: true,
	},
	addControl,
	children,
}: D3Props) => {
	const refCube = useRef<HTMLDivElement>()

	const { axes, matrix, add, fixed, change } = useOrientation(start, refCube)

	const [init, setInit] = useState<boolean>(true)
	const [mouse, setMouse] = useState<{
		x: number
		y: number
		axes: any
	} | null>(null)

	const [Z, setZ] = useState<number>(zoom.value)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			fixed()
			if (e.code === "Enter")
				setZ(Z + zoom.step > zoom.max ? zoom.max : Z + zoom.step)
			if (e.code === "Backspace")
				setZ(Z - zoom.step < zoom.min ? zoom.min : Z - zoom.step)
		},
		[Z]
	)

	const handleKeyUp = useCallback(
		(e: KeyboardEvent) => {
			if (e.code === "ArrowUp") add({ V: 10, H: 0 }, false)
			if (e.code === "ArrowDown") add({ V: -10, H: 0 }, false)
			if (e.code === "ArrowRight") add({ H: 10, V: 0 }, false)
			if (e.code === "ArrowLeft") add({ H: -10, V: 0 }, false)
		},
		[add]
	)

	const handleMouseDown = useCallback(
		e => {
			fixed()
			setMouse({
				x: e.clientX,
				y: e.clientY,
				axes,
			})
		},
		[axes]
	)

	const handleMouseMove = useCallback(
		e => {
			if (mouse) {
				clearTimeout(timer)
				timer = setTimeout(() => {
					const diffX = e.clientX - mouse.x
					const directionH = diffX > 0 ? 1 : -1

					const diffY = e.clientY - mouse.y
					const directionV = diffY > 0 ? -1 : 1

					const H =
						Math.abs(Math.floor(diffX / control.mouse.speed)) * directionH
					const V =
						Math.abs(Math.floor(diffY / control.mouse.speed)) * directionV

					add({ H, V }, true)
				}, 5)
			}
		},
		[mouse]
	)

	const handleMouseUp = useCallback(() => {
		setMouse(null)
	}, [])

	const handleMouseWheel = useCallback(
		e => {
			if (e.nativeEvent.wheelDelta > 0)
				setZ(Z + zoom.step > zoom.max ? zoom.max : Z + zoom.step)
			else setZ(Z - zoom.step < zoom.min ? zoom.min : Z - zoom.step)
		},
		[Z]
	)

	const handleReset = useCallback(() => {
		change(start, true)
		setZ(zoom.value)
	}, [])

	useEffect(() => {
		if (control.keyboard) {
			document.body.removeEventListener("keydown", handleKeyDown)
			document.body.removeEventListener("keyup", handleKeyUp)
			document.body.addEventListener("keydown", handleKeyDown)
			document.body.addEventListener("keyup", handleKeyUp)
			document.body.focus()
		}

		return () => {
			document.body.removeEventListener("keydown", handleKeyDown)
			document.body.removeEventListener("keyup", handleKeyUp)
		}
	}, [axes, Z])

	useEffect(() => {
		if (init) {
			handleReset()
		}
		setInit(false)
	}, [])

	useEffect(() => {
		if (set.i > 0) {
			fixed()
			add({ H: set.H, V: set.V }, true)
		}
	}, [set.i, set.i])

	return (
		<S.Wrapper
			mouseControl={control.mouse.activate}
			onMouseDown={control.mouse.activate ? e => handleMouseDown(e) : undefined}
			onMouseMove={control.mouse.activate ? e => handleMouseMove(e) : undefined}
			onMouseUp={control.mouse.activate ? () => handleMouseUp() : undefined}
			onWheel={control.mouse.activate ? e => handleMouseWheel(e) : undefined}
		>
			<S.Container
				size={size}
				margin={margin}
				style={{
					transition: `transform ${control.mouse.smoothing / 1000}s`,
					transform: `scale(${Z / 10})`,
				}}
			>
				<S.Cube
					ref={refCube}
					size={size}
					style={{
						transform: matrix.value,
						...(matrix.withTransition
							? { transition: `transform ${control.mouse.smoothing / 1000}s` }
							: {}),
					}}
				>
					{children}
				</S.Cube>
			</S.Container>

			{control.UI && (
				<Controller
					controls={[
						!isMobile ? { name: "help" } : null,
						{ name: "reset" },
						{ name: "zoom", min: zoom.min, max: zoom.max, value: Z },
						{ name: "rotation", type: "H", value: axes.values.H },
						{ name: "rotation", type: "V", value: axes.values.V },
					]}
					onChange={(name, value) => {
						if (name === "zoom") setZ(value as number)
						if (name === "rotationH") {
							fixed()
							add({ H: (value as { diff: number }).diff, V: 0 }, false)
						}
						if (name === "rotationV") {
							fixed()
							add({ V: (value as { diff: number }).diff, H: 0 }, false)
						}
						if (name === "reset") handleReset()
					}}
				>
					{addControl}
				</Controller>
			)}
		</S.Wrapper>
	)
}
