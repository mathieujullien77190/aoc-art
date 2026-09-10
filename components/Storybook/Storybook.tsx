import { pkg } from "_components/constants"

import * as S from "./UI"

/**
 * La doc du paquet, telle qu'elle est publiee. Un iframe plutot qu'un
 * lien : la fenetre du bureau est deja un cadre, le visiteur ne quitte
 * pas la machine pour lire le storybook.
 *
 * Elle n'est montee que fenetre ouverte — `Window` ne rend rien quand
 * elle est fermee — donc rien ne se charge tant qu'on ne clique pas.
 */
export const Storybook = () => (
	<S.Frame
		src={pkg.storybook}
		title="Flower Shell Storybook"
		loading="lazy"
		// la doc est sur un autre domaine : rien a lui laisser de plus
		sandbox="allow-scripts allow-same-origin allow-popups"
	/>
)
