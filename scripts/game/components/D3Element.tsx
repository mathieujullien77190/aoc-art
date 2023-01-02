/** @format */

import { useState, useCallback, useEffect } from "react"
import styled from "styled-components"

import { isMobile } from "react-device-detect"

import { Slider } from "./Slider"

const Wrapper = styled.div<{ mouseControl: boolean }>`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	overflow: hidden;
	user-select: none;

	cursor: ${({ mouseControl }) => (mouseControl ? "move" : "default")};
`

const Container = styled.div<{ size: number; margin: number }>`
	margin-top: ${({ margin }) => `${margin}px`};
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};
	perspective: ${({ size }) => `${size * 2}px`};
`

const Cube = styled.div<{ size: number; X: number; Y: number; Z: number }>`
	margin-top: -50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};
	position: relative;
	transform-style: preserve-3d;
	transform: ${({ size }) => `translateZ(-${size / 2}px)`};
	transition: transform 1s;
	transform: ${({ X, Y, Z }) =>
		`translateZ(${Z}px) rotateX(${X}deg) rotateY(${Y}deg)`};
`

const Control = styled.div`
	position: absolute;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: start;
	z-index: 10;

	p {
		padding: 5px;
		background: black;
		line-height: 25px;
	}
`

let timer = null

type State = { horizontal: number; vertical: number; zoom: number }

type D3ElementProps = {
	size: number
	start: State
	children: JSX.Element

	zoomMax?: number
	margin?: number
	current?: State
	control?: {
		mouse?: boolean
		keyboard?: boolean
		UI?: boolean
	}
	addControl?: JSX.Element

	onChangeH?: (value: number) => void
	onChangeV?: (value: number) => void
	onChangeZ?: (value: number) => void
}

export const D3Element = ({
	size,
	margin = 0,
	zoomMax = 200,
	start,
	current,
	control = { mouse: true, keyboard: true, UI: true },
	addControl,
	children,
	onChangeH = () => {},
	onChangeV = () => {},
	onChangeZ = () => {},
}: D3ElementProps) => {
	const [mouseH, setMouseH] = useState<{ x: number; H: number } | null>(null)
	const [mouseV, setMouseV] = useState<{ y: number; V: number } | null>(null)
	const [H, setH] = useState<number>(start.horizontal)
	const [V, setV] = useState<number>(start.vertical)
	const [Z, setZ] = useState<number>(start.zoom)

	const handleControl = useCallback((e: KeyboardEvent) => {
		if (e.code === "ArrowUp") setV(prev => prev + 10)
		if (e.code === "ArrowDown") setV(prev => prev - 10)
		if (e.code === "ArrowRight") setH(prev => prev + 10)
		if (e.code === "ArrowLeft") setH(prev => prev - 10)
		if (e.code === "Enter")
			setZ(prev => (prev + 10 > zoomMax ? zoomMax : prev + 10))
		if (e.code === "Backspace") setZ(prev => (prev - 10 < 0 ? 0 : prev - 10))
	}, [])

	const handleMouseDown = useCallback(
		e => {
			setMouseH({ x: e.clientX, H: H })
			setMouseV({ y: e.clientY, V: V })
		},
		[H, V]
	)

	const handleMouseMove = useCallback(
		e => {
			if (mouseH) {
				clearTimeout(timer)
				timer = setTimeout(() => {
					setH(
						() => mouseH.H + Math.floor((e.clientX - mouseH.x) / 2 / 10) * 10
					)
					setV(
						() => mouseV.V - Math.floor((e.clientY - mouseV.y) / 2 / 10) * 10
					)
				}, 5)
			}
		},
		[H, mouseH]
	)

	const handleMouseUp = useCallback(() => {
		setMouseH(null)
		setMouseV(null)
	}, [])

	const handleMouseWheel = useCallback(e => {
		if (e.nativeEvent.wheelDelta > 0)
			setZ(prev => (prev + 30 > zoomMax ? zoomMax : prev + 30))
		else setZ(prev => (prev - 30 < 0 ? 0 : prev - 30))
	}, [])

	useEffect(() => {
		if (control.keyboard) {
			document.body.addEventListener("keydown", handleControl)
			document.body.focus()
		}

		return () => {
			document.body.removeEventListener("keydown", handleControl)
		}
	}, [])

	useEffect(() => {
		if (current) {
			if (current.horizontal) setH(current.horizontal)
			if (current.vertical) setV(current.vertical)
			if (current.zoom) setZ(current.zoom)
		}
	}, [current])

	useEffect(() => {
		onChangeH(H)
	}, [H])

	useEffect(() => {
		onChangeV(V)
	}, [V])

	useEffect(() => {
		onChangeZ(Z)
	}, [Z])

	return (
		<Wrapper
			mouseControl={!!control.mouse}
			onMouseDown={!!control.mouse ? e => handleMouseDown(e) : undefined}
			onMouseMove={!!control.mouse ? e => handleMouseMove(e) : undefined}
			onMouseUp={!!control.mouse ? () => handleMouseUp() : undefined}
			onWheel={!!control.mouse ? e => handleMouseWheel(e) : undefined}
		>
			<Container size={size} margin={margin}>
				<Cube size={size} X={V} Y={H} Z={Z}>
					{children}
				</Cube>
			</Container>

			{control.UI && (
				<Control>
					{!isMobile && (
						<p>
							Contrôle souris : click + drag + wheel + right click
							<br />
							Contrôle clavier : [→] [←] [↑] [↓] [Enter] [Backspace]
						</p>
					)}
					<Slider
						width={isMobile ? "auto" : "280px"}
						label="Zoom"
						min={0}
						max={zoomMax}
						step={10}
						bigStep={50}
						unit="%"
						value={Z}
						onChange={setZ}
					/>
					<Slider
						width={isMobile ? "auto" : "280px"}
						label="Rotation horyzontal"
						min={0}
						max={360}
						loop
						step={10}
						bigStep={90}
						unit="°"
						value={H}
						onChange={setH}
					/>
					<Slider
						width={isMobile ? "auto" : "280px"}
						label="Rotation vertical"
						min={0}
						max={360}
						loop
						step={10}
						bigStep={90}
						unit="°"
						value={V}
						onChange={setV}
					/>
					{addControl}
				</Control>
			)}
		</Wrapper>
	)
}
