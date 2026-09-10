import { useRef, useState, Ref, forwardRef } from "react"

import { globalActions, useGetLang, useGetWindows } from "_store/global/"

import { DesktopIcon, IconKey, WindowName, WindowsProps } from "./types"
import { FULL, ICONS, WINDOW_NAMES } from "./constants"
import { iconOf, isWindowIcon, labelOf } from "./helpers"
import { useIsCompact } from "./hooks"
import * as S from "./UI"

import Window, { TOP_LAYER } from "_components/Window"
import Icon from "../Icon"
import Date from "../Date"
import Prism from "_projects/prism"
import Storybook from "_components/Storybook"
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

	const lang = useGetLang()

	// le seuil est a nous : le paquet ne connait aucune taille d'ecran
	const compact = useIsCompact()

	/**
	 * Rang d'agrandissement du shell : une icone qui l'ouvre l'avance, la
	 * fenetre s'ouvre alors en grand. Le visiteur reste libre de la
	 * reduire ensuite, la demande suivante la reouvrira pleine.
	 */
	const [expand, setExpand] = useState<number>(0)

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

	/** l'icone s'allume quand ce qu'elle ouvre est a l'ecran */
	const isIconOpen = (key: IconKey) => {
		// une icone qui joue une commande n'ouvre rien, elle rend la main
		if (iconOf(key).command) return false
		return isWindowIcon(key) && isOpen(key)
	}

	const handleIcon = (key: IconKey) => {
		const { command } = iconOf(key)

		// la commande s'ecrit dans le shell, qui passe devant en grand :
		// les sorties sont larges, une fenetre moyenne les replierait
		if (command) {
			setExpand(prev => prev + 1)
			focus("shell")
			onRunCommand(command)
			return
		}

		if (!isWindowIcon(key)) return

		// lu avant le clic : seul le shell au premier plan se ferme, et il
		// est encore monte a cet instant — l'ouvrir ne doit rien vider, il
		// n'y a alors aucun terminal a qui parler
		const closing = key === "shell" && stack[stack.length - 1] === "shell"

		handleWindowIcon(key)

		// le shell ferme par son icone repart vide
		if (closing) onCloseWindow()
	}

	const globalRef = useRef<HTMLDivElement>(null)

	/** une icone du bureau, ou du coin : seule la place change */
	const desktopIcon = (icon: DesktopIcon) => (
		<Icon
			key={icon.key}
			open={isIconOpen(icon.key)}
			name={labelOf(icon.key, lang)}
			image={icon.image}
			latch={!icon.command}
			onClick={() => handleIcon(icon.key)}
		/>
	)

	return (
		<S.Container ref={globalRef}>
			{/* la fenetre rongee jusqu'a l'os emporte la machine avec elle */}
			<Virus onDead={() => onBlueScreen(true)} />

			{ICONS.filter(icon => !icon.corner).map(desktopIcon)}

			<S.Corner>{ICONS.filter(icon => icon.corner).map(desktopIcon)}</S.Corner>

			<Window
				show={isOpen("shell")}
				container={globalRef}
				title={labelOf("shell", lang)}
				mark="shell"
				expand={expand}
				layer={layer("shell")}
				bottomInset={FULL.heightBar}
				compact={compact}
				flush
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

			{/* la doc du paquet, chargee depuis GitHub Pages : elle porte sa
			    propre mise en page, la fenetre lui laisse tout le cadre */}
			<Window
				show={isOpen("storybook")}
				container={globalRef}
				title={labelOf("storybook", lang)}
				layer={layer("storybook")}
				bottomInset={FULL.heightBar}
				compact={compact}
				flush
				rank={rankOf("storybook")}
				onFocus={() => focus("storybook")}
				onClose={() => close("storybook")}
			>
				<Storybook />
			</Window>

			<S.Bar>
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
