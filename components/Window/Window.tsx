import { useEffect, useRef, useState, Ref, forwardRef } from "react"
import { WindowProps, Pos, Mode } from "./types"
import * as S from "./UI"
import { ANIM_TIME, TOP_LAYER } from "./constants"
import { clampDrag } from "./helpers"

const NO_DRAG: Pos = { x: 0, y: 0 }

const BaseWindow = (
	{
		show,
		container,
		children,
		title = "Sans titre",
		mark,
		expand = 0,
		layer = TOP_LAYER,
		rank = 0,
		bottomInset = "0px",
		compact = false,
		phone = false,
		flush = false,
		onFocus = () => {},
		onClose = () => {},
	}: WindowProps,
	ref: Ref<HTMLDivElement>
) => {
	const [userMode, setUserMode] = useState<Mode>("medium")

	// compact keeps the window full and not resizable; "close" still goes
	// through, or the closing animation would vanish
	const mode: Mode = compact && userMode !== "close" ? "full" : userMode

	/**
	 * Mouse offset in pixels, on top of a base position in percent. Measuring
	 * the desktop needed an effect and a setState on mount; a percentage
	 * gives the same placement, follows resizing, and needs neither.
	 */
	const [drag, setDrag] = useState<Pos>(NO_DRAG)
	const [ready, setReady] = useState<boolean>(false)
	const [followMouse, setFollowMouse] = useState<boolean>(false)

	// the parent asks for the large size by bumping its rank; follow it during
	// render, an effect would flash the previous size
	const [prevExpand, setPrevExpand] = useState<number>(expand)

	if (prevExpand !== expand) {
		setPrevExpand(expand)
		setDrag(NO_DRAG)
		setUserMode("full")
	}

	const boxRef = useRef<HTMLDivElement>(null)

	// content only shows once the window has reached its size
	useEffect(() => {
		if (!show || mode === "close") return

		const timer = window.setTimeout(() => setReady(true), ANIM_TIME + 100)
		return () => window.clearTimeout(timer)
	}, [show, mode])

	const handleResize = () => {
		// changing size puts the window back in place: the previous offset makes
		// no sense in the new template
		setDrag(NO_DRAG)
		setUserMode(prev => (prev === "full" ? "medium" : "full"))
	}

	const handleClose = () => {
		// already closing: the previous mode would be lost
		if (userMode === "close") return

		// the window reopens as it was left, size and place
		const before = userMode

		setReady(false)
		setUserMode("close")
		window.setTimeout(() => {
			onClose()
			setUserMode(before)
		}, ANIM_TIME + 100)
	}

	useEffect(() => {
		if (!followMouse) return

		const handlerMousemove = (event: MouseEvent) => {
			setDrag(prev => ({
				x: prev.x + event.movementX,
				y: prev.y + event.movementY,
			}))
		}

		/**
		 * The release rarely lands on the title bar, often outside the page:
		 * without a document-level listener the window would stick to the
		 * cursor. Blur covers a mouse released outside the tab, which emits no
		 * mouseup.
		 */
		const handlerMouseup = () => {
			setFollowMouse(false)

			const area = container.current?.getBoundingClientRect()
			const box = boxRef.current?.getBoundingClientRect()
			if (area && box) setDrag(prev => clampDrag(prev, box, area))
		}

		document.addEventListener("mousemove", handlerMousemove)
		document.addEventListener("mouseup", handlerMouseup)
		window.addEventListener("blur", handlerMouseup)

		return () => {
			document.removeEventListener("mousemove", handlerMousemove)
			document.removeEventListener("mouseup", handlerMouseup)
			window.removeEventListener("blur", handlerMouseup)
		}
	}, [followMouse, container])

	return (
		<>
			{show && (
				<S.Container
					data-window={mark}
					ref={boxRef}
					$mode={mode}
					$rank={rank}
					$drag={drag}
					$followMouse={followMouse}
					$layer={layer}
					$bottomInset={bottomInset}
					$phone={phone}
					onMouseDown={onFocus}
				>
					<S.topBar
						onDoubleClick={compact || phone ? undefined : handleResize}
						onMouseDown={() => {
							if (mode !== "full") setFollowMouse(true)
						}}
					>
						<S.Title>{title}</S.Title>
						<S.Actions>
							{!compact && !phone && (
								<span onClick={handleResize}>
									{mode === "full" ? "-" : "+"}
								</span>
							)}
							<span onClick={handleClose}>x</span>
						</S.Actions>
					</S.topBar>
					<S.Content $flush={flush} ref={ref}>
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
