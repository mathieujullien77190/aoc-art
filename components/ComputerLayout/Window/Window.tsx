import { useEffect, useState, Ref, forwardRef } from "react"
import { WindowProps, Pos, Size, Mode } from "./types"
import * as S from "./UI"
import { ANIM_TIME } from "./constants"
import { useIsCompact } from "./hooks"

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
	const isCompact = useIsCompact()
	const [userMode, setUserMode] = useState<Mode>("medium")

	// sous le seuil la fenetre reste pleine et non redimensionnable.
	// "close" passe quand meme, sinon l'animation de fermeture disparaitrait
	const mode: Mode = isCompact && userMode !== "close" ? "full" : userMode
	const [pos, setPos] = useState<Pos>({ x: 0, y: 0 })
	const [size, setSize] = useState<Size>({ width: 0, height: 0, unit: "px" })
	const [ready, setReady] = useState<boolean>(false)
	const [followMouse, setFollowMouse] = useState<boolean>(false)

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
		setUserMode(prev => (prev === "full" ? "medium" : "full"))
	}

	const handleClose = () => {
		setReady(false)
		setUserMode("close")
		window.setTimeout(() => {
			onClose()

			setUserMode("medium")
		}, ANIM_TIME + 100)
	}

	useEffect(() => {
		if (!followMouse) return

		const handlerMousemove = e => {
			setPos(prev => ({
				x: prev.x + e.movementX,
				y: prev.y + e.movementY,
			}))
		}
		document.addEventListener("mousemove", handlerMousemove)
		return () => {
			document.removeEventListener("mousemove", handlerMousemove)
		}
	}, [followMouse])

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
					$followMouse={followMouse}
				>
					<S.topBar
						onDoubleClick={isCompact ? undefined : handleResize}
						onMouseDown={() => {
							if (mode !== "full") setFollowMouse(true)
						}}
						onMouseUp={() => {
							setFollowMouse(false)
						}}
					>
						<S.Title>{title}</S.Title>
						<S.Actions>
							{!isCompact && (
								<span onClick={handleResize}>
									{mode === "full" ? "-" : "+"}
								</span>
							)}
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
