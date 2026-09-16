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

	// en mode compact la fenetre reste pleine et non redimensionnable.
	// "close" passe quand meme, sinon l'animation de fermeture disparaitrait
	const mode: Mode = compact && userMode !== "close" ? "full" : userMode

	/**
	 * Deplacement applique a la souris, en pixels, par-dessus une position
	 * de base en pourcentage. Mesurer le bureau pour poser la fenetre
	 * demandait un effet et un setState au montage ; le pourcentage donne
	 * le meme placement, suit le redimensionnement, et se passe des deux.
	 */
	const [drag, setDrag] = useState<Pos>(NO_DRAG)
	const [ready, setReady] = useState<boolean>(false)
	const [followMouse, setFollowMouse] = useState<boolean>(false)

	// le parent demande le grand format en avancant son rang ; on le suit
	// pendant le rendu, un effet ferait clignoter la taille d'avant
	const [prevExpand, setPrevExpand] = useState<number>(expand)

	if (prevExpand !== expand) {
		setPrevExpand(expand)
		setDrag(NO_DRAG)
		setUserMode("full")
	}

	const boxRef = useRef<HTMLDivElement>(null)

	// le contenu n'apparait qu'une fois la fenetre arrivee a sa taille
	useEffect(() => {
		if (!show || mode === "close") return

		const timer = window.setTimeout(() => setReady(true), ANIM_TIME + 100)
		return () => window.clearTimeout(timer)
	}, [show, mode])

	const handleResize = () => {
		// changer de taille remet la fenetre a sa place : le deplacement
		// d'avant n'a plus de sens dans le nouveau gabarit
		setDrag(NO_DRAG)
		setUserMode(prev => (prev === "full" ? "medium" : "full"))
	}

	const handleClose = () => {
		// deja en train de se fermer : le mode d'avant serait perdu
		if (userMode === "close") return

		// la fenetre rouvre telle qu'on l'a quittee, taille et place
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
		 * Le relachement tombe rarement sur la barre de titre, souvent
		 * hors de la page : sans ecoute au niveau du document, la fenetre
		 * resterait collee au curseur. Le blur couvre la souris relachee
		 * en dehors de l'onglet, qui n'emet aucun mouseup.
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
