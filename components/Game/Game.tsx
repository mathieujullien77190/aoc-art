import { useEffect, useRef } from "react"

import { game } from "_components/constants"

import * as S from "./UI"

/**
 * The mini-game, published on GitHub Pages from its own repo, in an iframe
 * like the Storybook docs: the desktop window is the frame.
 *
 * Only mounted while the window is open, so nothing loads until clicked.
 *
 * GitHub Pages serves it behind a browser cache: without a cache-bust
 * parameter, reopening replays the cached build. Date.now() is impure and
 * the React Compiler rejects it during render (even via useMemo or a
 * setState in an effect), so the effect writes `src` on the DOM node
 * directly.
 */
export const Game = () => {
	const ref = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		if (ref.current) ref.current.src = `${game.url}?t=${Date.now()}`
	}, [])

	return (
		<S.Frame
			ref={ref}
			title="Tic-Tac-Tic"
			loading="lazy"
			// the game is on another domain: nothing more to grant it
			sandbox="allow-scripts allow-same-origin allow-popups"
		/>
	)
}
