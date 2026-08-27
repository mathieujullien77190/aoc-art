import { useGetVirus } from "_store/global/"

import { useVirus } from "./hooks"
import { VirusProps } from "./types"

/**
 * La fenetre du shell se troue : une case de vingt par vingt disparait de
 * temps en temps, a partir d'un point pris en haut, et on voit le bureau
 * a travers. Quand il n'en reste rien, la machine rend l'ame.
 *
 * Rien a rendre : tout se joue sur le masque de la fenetre. La commande
 * stux pose une graine dans le store, la rejouer en change la valeur et
 * repart d'une fenetre intacte.
 */
export const Virus = ({ onDead = () => {} }: VirusProps) => {
	const seed = useGetVirus()

	useVirus(seed, onDead)

	return null
}
