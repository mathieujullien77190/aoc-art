import { useState, useRef, Ref, forwardRef } from "react"

import { globalActions, useGetTutorial, useGetWindows } from "_store/global/"

import { IconKey, WindowName, WindowsProps } from "./types"
import { FULL, ICONS, WINDOW_NAMES } from "./constants"
import { iconOf, labelOf } from "./helpers"
import { useIsCompact } from "./hooks"
import * as S from "./UI"

import { TOP_LAYER, useLang, Window } from "flower-shell"
import Icon from "../Icon"
import Date from "../Date"
import Prism from "_projects/prism"
import CvDialog, { downloadCv } from "../CvDialog"
import Virus from "_components/Virus"

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

	const lang = useLang()

	// le seuil est a nous : le paquet ne connait aucune taille d'ecran
	const compact = useIsCompact()
	const tutorial = useGetTutorial()

	const [cvDialog, setCvDialog] = useState<boolean>(false)

	const isOpen = (name: WindowName) => stack.includes(name)

	/** ouvre la fenetre, ou la remonte si elle etait dessous */
	const focus = (name: WindowName) => globalActions().focusWindow(name)

	const close = (name: WindowName) => globalActions().closeWindow(name)

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

	/** L'icone d'aide bascule la visite guidee. */
	const handleTutorial = () => {
		if (tutorial) {
			globalActions().setProperty("tutorial", false)
			return
		}

		// la visite commence sur un bureau net : elle designe des elements du
		// shell, une fenetre posee par-dessus les cacherait
		setCvDialog(false)
		WINDOW_NAMES.filter(name => name !== "shell" && isOpen(name)).forEach(close)
		focus("shell")

		globalActions().setProperty("tutorial", true)
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
			{/* la fenetre rongee jusqu'a l'os emporte la machine avec elle */}
			<Virus onDead={() => onBlueScreen(true)} />

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
				mark="shell"
				layer={layer("shell")}
				bottomInset={FULL.heightBar}
				compact={compact}
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
				bottomInset={FULL.heightBar}
				compact={compact}
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
