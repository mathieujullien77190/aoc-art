import { useState, useRef, Ref, forwardRef } from "react"

import { useAppDispatch } from "_store/hooks"
import { closeWindow, focusWindow, useGetWindows } from "_store/global/"

import { WindowsProps } from "./types"
import * as S from "./UI"

import Window from "../Window"
import { TOP_LAYER } from "../Window/constants"
import Icon from "../Icon"
import Date from "../Date"
import Prism from "_projects/prism"
import CvDialog, { downloadCv } from "../CvDialog"

type Name = "shell" | "prism"

/**
 * Les fenetres du bureau, dans l'ordre. Il sert aux libelles de la
 * barre des taches et au decalage en cascade a l'ouverture.
 */
const WINDOWS: { name: Name; label: string; image: string }[] = [
	{ name: "shell", label: "Flower Shell", image: "🌼" },
	{ name: "prism", label: "1/PRISM", image: "📡" },
]

const rankOf = (name: Name) => WINDOWS.findIndex(item => item.name === name)

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
	const stack = useGetWindows() as Name[]
	const dispatch = useAppDispatch()

	const [cvDialog, setCvDialog] = useState<boolean>(false)

	const isOpen = (name: Name) => stack.includes(name)

	/** ouvre la fenetre, ou la remonte si elle etait dessous */
	const focus = (name: Name) => dispatch(focusWindow(name))

	const close = (name: Name) => dispatch(closeWindow(name))

	/**
	 * L'icone ferme sa fenetre seulement si elle est deja au premier plan.
	 * Cachee derriere une autre, on veut la voir, pas la perdre.
	 */
	const handleIcon = (name: Name) => {
		if (stack[stack.length - 1] === name) close(name)
		else focus(name)
	}

	/** etage d'empilement : le sommet de la pile passe devant */
	const layer = (name: Name) =>
		TOP_LAYER - (stack.length - 1 - stack.indexOf(name))

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
			<Icon
				open={isOpen("shell")}
				name="Flower Shell"
				image="🌼"
				onClick={() => {
					handleIcon("shell")
					onCloseWindow()
				}}
			/>

			<Icon
				open={isOpen("prism")}
				name="1/PRISM"
				image="📡"
				onClick={() => handleIcon("prism")}
			/>

			<Icon
				open={cvDialog}
				name="CV"
				image="📄"
				onClick={() => setCvDialog(prev => !prev)}
			/>

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
				title="Flower Shell"
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
				title="1/PRISM"
				layer={layer("prism")}
				rank={rankOf("prism")}
				onFocus={() => focus("prism")}
				onClose={() => close("prism")}
			>
				<Prism />
			</Window>

			<S.Bar>
				<S.Tasks>
					{WINDOWS.filter(item => isOpen(item.name)).map(item => (
						<S.Task
							key={item.name}
							$active={stack[stack.length - 1] === item.name}
							onClick={() => focus(item.name)}
						>
							{item.image} {item.label}
						</S.Task>
					))}
				</S.Tasks>

				<Date withDate withTime onClick={onBlueScreen} />
			</S.Bar>
		</S.Container>
	)
}

export const Windows = forwardRef<HTMLDivElement, WindowsProps>(BaseWindows)
