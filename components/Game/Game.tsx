import { game } from "_components/constants"

import * as S from "./UI"

/**
 * Le mini-jeu, publie sur GitHub Pages depuis son propre depot. Un iframe,
 * comme la doc du Storybook : la fenetre du bureau sert de cadre, le
 * visiteur ne quitte pas la machine pour y jouer.
 *
 * Elle n'est montee que fenetre ouverte — `Window` ne rend rien quand elle
 * est fermee — donc rien ne se charge tant qu'on ne clique pas.
 */
export const Game = () => (
	<S.Frame
		src={game.url}
		title="Tic-Tac-Tic"
		loading="lazy"
		// le jeu est sur un autre domaine : rien a lui laisser de plus
		sandbox="allow-scripts allow-same-origin allow-popups"
	/>
)
