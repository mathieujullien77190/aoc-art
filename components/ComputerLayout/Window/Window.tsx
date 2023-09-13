import { useEffect, useState, useRef, Ref, forwardRef } from "react"
import { WindowProps, Pos, Size, Mode } from "./types"
import * as S from "./UI"
import { ANIM_TIME } from "./constants"

const BaseWindow = (
	{
		show,
		container,
		children,
		title = "Sans titre",
		onClose = () => {},
	}: WindowProps,
	ref: Ref<HTMLDivElement>
) => {
	const [mode, setMode] = useState<Mode>("medium")
	const [pos, setPos] = useState<Pos>({ x: 0, y: 0 })
	const [size, setSize] = useState<Size>({ width: 0, height: 0, unit: "px" })
	const [ready, setReady] = useState<boolean>(false)
	const followMouse = useRef<boolean>(false)

	useEffect(() => {
		if (show) {
			const rect = container.current?.getBoundingClientRect()

			if (mode === "full" && rect) {
				setPos({ x: 0, y: 0 })
				setSize({ width: 100, height: 100, unit: "%" })
				window.setTimeout(() => {
					setReady(true)
				}, ANIM_TIME + 100)
			}
			if (mode === "medium" && rect) {
				setPos({ x: rect.width * 0.15, y: rect.height * 0.15 })
				setSize({
					width: rect.width * 0.7,
					height: rect.height * 0.7,
					unit: "px",
				})
				window.setTimeout(() => {
					setReady(true)
				}, ANIM_TIME + 100)
			}
			if (mode === "close" && rect) {
				setPos({ x: rect.width / 2, y: rect.height / 2 })
				setSize({
					width: 0,
					height: 0,
					unit: "px",
				})
			}
		}
	}, [show, mode])

	const handleResize = () => {
		setMode(prev => (prev === "full" ? "medium" : "full"))
	}

	const handleClose = () => {
		setReady(false)
		setMode("close")
		window.setTimeout(() => {
			onClose()

			setMode("medium")
		}, ANIM_TIME + 100)
	}

	useEffect(() => {
		const handlerMousemove = e => {
			if (followMouse.current) {
				setPos(prev => ({
					x: prev.x + e.movementX,
					y: prev.y + e.movementY,
				}))
			}
		}
		document.addEventListener("mousemove", handlerMousemove)
		return () => {
			document.removeEventListener("mousemove", handlerMousemove)
		}
	}, [])

	return (
		<>
			{show && (
				<S.Container
					style={{
						top: `${pos.y}px`,
						left: `${pos.x}px`,
					}}
					$size={size}
					$mode={mode}
					$followMouse={followMouse.current}
				>
					<S.topBar
						onMouseDown={() => {
							followMouse.current = true
						}}
						onMouseUp={() => {
							followMouse.current = false
						}}
					>
						<S.Title>{title}</S.Title>
						<S.Actions>
							<span onClick={handleResize}>{mode === "full" ? "-" : "+"}</span>
							<span onClick={handleClose}>x</span>
						</S.Actions>
					</S.topBar>
					<S.Content ref={ref}>
						<S.Wrapper $ready={ready} $mode={mode}>
							{children}
						</S.Wrapper>
					</S.Content>
				</S.Container>
			)}
		</>
	)
}

export const Window = forwardRef<HTMLDivElement, WindowProps>(BaseWindow)
