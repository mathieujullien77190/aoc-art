import { useRef } from "react"

import { useGetFlowers } from "_store/global/"

import { useFlowers } from "./hooks"
import { Side } from "./types"
import * as S from "./UI"

const Plant = ({ side, seed }: { side: Side; seed: number }) => {
	const containerRef = useRef<HTMLDivElement>(null)

	useFlowers(containerRef, side, seed)

	return <S.Container ref={containerRef} />
}

/**
 * Une plante par coin bas de l'ecran, chacune tiree au hasard de son cote.
 * Rien ne pousse tant que la commande flowers n'a pas tourne ; la rejouer
 * change la graine, donc replante les deux.
 */
export const Flowers = () => {
	const seed = useGetFlowers()

	if (!seed) return null

	return (
		<>
			<Plant side="left" seed={seed} />
			<Plant side="right" seed={seed} />
		</>
	)
}
