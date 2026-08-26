/** @format */

import { useRef } from "react"

import { useVirus } from "./hooks"
import * as S from "./UI"

/**
 * Recouvre l'ecran de noir par taches qui s'etendent.
 *
 * Un clic nettoie une large zone, que la contamination peut ensuite reprendre.
 * Une fois l'ecran entierement noir, REFRESH apparait au centre : les memes
 * blocs, passes du noir au blanc en fondu, et le clic ne repond plus.
 */
export const Virus = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useVirus(canvasRef)

	return <S.Canvas ref={canvasRef} />
}
