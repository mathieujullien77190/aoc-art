import { pkg } from "_components/constants"

import * as S from "./UI"

/**
 * The package docs, as published. An iframe rather than a link: the desktop
 * window is already a frame.
 *
 * Only mounted while the window is open, so nothing loads until clicked.
 */
export const Storybook = () => (
	<S.Frame
		src={pkg.storybook}
		title="Flower Shell Storybook"
		loading="lazy"
		// the docs are on another domain: nothing more to grant them
		sandbox="allow-scripts allow-same-origin allow-popups"
	/>
)
