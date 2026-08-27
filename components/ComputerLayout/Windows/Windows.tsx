import { useState, useRef, Ref, forwardRef } from "react"

import { useAppDispatch } from "_store/hooks"
import {
	closeWindow,
	focusWindow,
	setProperties,
	useGetLanguage,
	useGetTutorial,
	useGetWindows,
} from "_store/global/"

import { IconKey, WindowName, WindowsProps } from "./types"
import { ICONS, WINDOW_NAMES } from "./constants"
import { iconOf, labelOf } from "./helpers"
import * as S from "./UI"

import Window from "../Window"
import { TOP_LAYER } from "../Window/constants"
import Icon from "../Icon"
import Date from "../Date"
import Prism from "_projects/prism"
import CvDialog, { downloadCv } from "../CvDialog"
import { markSeen } from "../Tutorial"

const rankOf = (name: WindowName) => WINDOW_NAMES.indexOf(name)

const BaseWindows = (
	{
		children,
		onBlueScreen = () => {},
		onRunCommand = () => {},
		onCloseWindow = () => {},
	}: WindowsProps,
	ref: Ref<HTMLDivElement>
) => {
	// la pile vit dans le store : une commande du shell peut ainsi
	// ouvrir une fenetre, comme la commande prism
	const stack = useGetWindows() as WindowName[]
	const dispatch = useAppDispatch()

	const lang = useGetLanguage()
	const tutorial = useGetTutorial()

	const [cvDialog, setCvDialog] = useState<boolean>(false)

	const isOpen = (name: WindowName) => stack.includes(name)

	/** ouvre la fenetre, ou la remonte si elle etait dessous */
	const focus = (name: WindowName) => dispatch(focusWindow(name))

	const close = (name: WindowName) => dispatch(closeWindow(name))

	/**
	 * L'icone ferme sa fenetre seulement si elle est deja au premier plan.
	 * Cachee derriere une autre, on veut la voir, pas la perdre.
	 */
	const handleWindowIcon = (name: WindowName) => {
		if (stack[stack.length - 1] === name) close(name)
		else focus(name)
	}

	/** etage d'empilement : le sommet de la pile passe devant */
	const layer = (name: WindowName) =>
		TOP_LAYER - (stack.length - 1 - stack.indexOf(name))

	/**
	 * L'icone d'aide bascule la visite guidee. L'eteindre vaut pour l'avoir
	 * vue : elle ne se rouvrira plus d'elle-meme a la prochaine venue.
	 */
	const handleTutorial = () => {
		if (tutorial) {
			markSeen()
			dispatch(setProperties({ key: "tutorial", value: false }))
			return
		}

		// la visite commence sur un bureau net : elle designe des elements du
		// shell, une fenetre posee par-dessus les cacherait
		setCvDialog(false)
		WINDOW_NAMES.filter(name => name !== "shell" && isOpen(name)).forEach(close)
		focus("shell")

		dispatch(setProperties({ key: "tutorial", value: true }))
	}

	/** l'icone s'allume quand ce qu'elle ouvre est a l'ecran */
	const isIconOpen = (key: IconKey) => {
		if (key === "cv") return cvDialog
		if (key === "help") return tutorial
		return isOpen(key)
	}

	const handleIcon = (key: IconKey) => {
		if (key === "cv") {
			setCvDialog(prev => !prev)
			return
		}

		if (key === "help") {
			handleTutorial()
			return
		}

		handleWindowIcon(key)

		// le shell ferme par son icone repart vide
		if (key === "shell") onCloseWindow()
	}

	/** le CV en ASCII : le shell passe devant et joue la commande */
	const showAsciiCv = () => {
		setCvDialog(false)
		focus("shell")
		onRunCommand("cv")
	}

	/** le PDF part dans un onglet, la machine ne s'en remet pas */
	const downloadPdfCv = () => {
		setCvDialog(false)
		downloadCv()
		onBlueScreen(true)
	}

	const globalRef = useRef<HTMLDivElement>(null)

	return (
		<S.Container ref={globalRef}>
			{ICONS.map(icon => (
				<Icon
					key={icon.key}
					open={isIconOpen(icon.key)}
					name={labelOf(icon.key, lang)}
					image={icon.image}
					tutorial={icon.tutorial}
					onClick={() => handleIcon(icon.key)}
				/>
			))}

			{cvDialog && (
				<CvDialog
					onAscii={showAsciiCv}
					onPdf={downloadPdfCv}
					onClose={() => setCvDialog(false)}
				/>
			)}

			<Window
				show={isOpen("shell")}
				container={globalRef}
				title={labelOf("shell", lang)}
				tutorial="titlebar-shell"
				layer={layer("shell")}
				rank={rankOf("shell")}
				onFocus={() => focus("shell")}
				onClose={() => {
					close("shell")
					onCloseWindow()
				}}
				ref={ref}
			>
				{children}
			</Window>

			<Window
				show={isOpen("prism")}
				container={globalRef}
				title={labelOf("prism", lang)}
				layer={layer("prism")}
				rank={rankOf("prism")}
				onFocus={() => focus("prism")}
				onClose={() => close("prism")}
			>
				<Prism />
			</Window>

			<S.Bar data-tutorial="taskbar">
				<S.Tasks>
					{WINDOW_NAMES.filter(isOpen).map(name => (
						<S.Task
							key={name}
							$active={stack[stack.length - 1] === name}
							onClick={() => focus(name)}
						>
							{iconOf(name).image} {labelOf(name, lang)}
						</S.Task>
					))}
				</S.Tasks>

				<Date withDate withTime onClick={onBlueScreen} />
			</S.Bar>
		</S.Container>
	)
}

export const Windows = forwardRef<HTMLDivElement, WindowsProps>(BaseWindows)
