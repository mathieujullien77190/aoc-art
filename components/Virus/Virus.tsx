import { useGetVirus } from "_store/global/"

import { useVirus } from "./hooks"
import { VirusProps } from "./types"

/**
 * The shell window gets holes: a 20 by 20 cell vanishes now and then, from
 * a point at the top, showing the desktop through. When nothing is left,
 * the machine gives up.
 *
 * Nothing to render: it all happens on the window mask. The stux command
 * sets a seed in the store; replaying it changes the value and starts over
 * from an intact window.
 */
export const Virus = ({ onDead = () => {} }: VirusProps) => {
	const seed = useGetVirus()

	useVirus(seed, onDead)

	return null
}
