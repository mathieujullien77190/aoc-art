import { useRef, useState, Ref, forwardRef } from "react"

import { globalActions, useGetLang, useGetWindows } from "_store/global/"
import { azimut, game } from "_components/constants"

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
import Game from "_components/Game"
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
	// the stack lives in the store: a shell command can open a window, like
	// the prism command
	const stack = useGetWindows() as WindowName[]

	const lang = useGetLang()

	// the threshold is ours: the package knows no screen size
	const compact = useIsCompact()

	/**
	 * Enlarge rank of the shell: an icon that opens it bumps it, so the window
	 * opens large. The visitor can shrink it after, the next request reopens
	 * it full.
	 */
	const [expand, setExpand] = useState<number>(0)

	const isOpen = (name: WindowName) => stack.includes(name)

	/** opens the window, or raises it if it was below */
	const focus = (name: WindowName) => globalActions().focusWindow(name)

	const close = (name: WindowName) => globalActions().closeWindow(name)

	/**
	 * The icon closes its window only if it is already in front. Hidden behind
	 * another, we want to see it, not lose it.
	 */
	const handleWindowIcon = (name: WindowName) => {
		if (stack[stack.length - 1] === name) close(name)
		else focus(name)
	}

	/** stacking level: the top of the stack goes in front */
	const layer = (name: WindowName) =>
		TOP_LAYER - (stack.length - 1 - stack.indexOf(name))

	/** the icon lights up when what it opens is on screen */
	const isIconOpen = (key: IconKey) => {
		// an icon that plays a command opens nothing, it hands back
		if (iconOf(key).command) return false
		return isWindowIcon(key) && isOpen(key)
	}

	const handleIcon = (key: IconKey) => {
		const { command } = iconOf(key)

		// the command is written in the shell, which comes to the front large:
		// outputs are wide, a medium window would wrap them
		if (command) {
			setExpand(prev => prev + 1)
			focus("shell")
			onRunCommand(command)
			return
		}

		if (!isWindowIcon(key)) return

		// read before the click: only the front shell closes, and it is still
		// mounted at that moment — opening it must empty nothing, there is no
		// terminal to talk to yet
		const closing = key === "shell" && stack[stack.length - 1] === "shell"

		handleWindowIcon(key)

		// the shell closed by its icon restarts empty
		if (closing) onCloseWindow()
	}

	const globalRef = useRef<HTMLDivElement>(null)

	/** a desktop or corner icon: only the place changes */
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
			{/* a window gnawed to the bone takes the machine down with it */}
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

			{/* the package docs, loaded from GitHub Pages: they bring their own
			    layout, the window leaves them the whole frame */}
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

			{/* the mini-game, made for a phone screen: the window keeps that
			    template rather than the usual medium square */}
			<Window
				show={isOpen("game")}
				container={globalRef}
				title={labelOf("game", lang)}
				layer={layer("game")}
				bottomInset={FULL.heightBar}
				compact={compact}
				phone
				flush
				rank={rankOf("game")}
				onFocus={() => focus("game")}
				onClose={() => close("game")}
			>
				<Game url={game.url} title="Tic-Tac-Tic" />
			</Window>

			{/* the second mini-game, same phone template */}
			<Window
				show={isOpen("azimut")}
				container={globalRef}
				title={labelOf("azimut", lang)}
				layer={layer("azimut")}
				bottomInset={FULL.heightBar}
				compact={compact}
				phone
				flush
				rank={rankOf("azimut")}
				onFocus={() => focus("azimut")}
				onClose={() => close("azimut")}
			>
				<Game url={azimut.url} title="Full Azimut" />
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
