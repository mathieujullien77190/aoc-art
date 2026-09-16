import { useEffect, useRef } from "react"

import { game } from "_components/constants"

import * as S from "./UI"

/**
 * Le mini-jeu, publie sur GitHub Pages depuis son propre depot. Un iframe,
 * comme la doc du Storybook : la fenetre du bureau sert de cadre, le
 * visiteur ne quitte pas la machine pour y jouer.
 *
 * Elle n'est montee que fenetre ouverte — `Window` ne rend rien quand elle
 * est fermee — donc rien ne se charge tant qu'on ne clique pas.
 *
 * GitHub Pages sert ce depot derriere un cache navigateur : sans parametre
 * de cache-bust, rouvrir la fenetre rejoue la version deja en cache plutot
 * que la derniere publiee. `Date.now()` est impur — le React Compiler
 * refuse qu'il tourne pendant le rendu, meme via `useMemo` ou un `setState`
 * dans un effet — donc l'effet ecrit `src` directement sur le noeud DOM,
 * synchronisation imperative classique plutot qu'un aller-retour par l'etat.
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
			// le jeu est sur un autre domaine : rien a lui laisser de plus
			sandbox="allow-scripts allow-same-origin allow-popups"
		/>
	)
}
