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
 * One plant per bottom corner, each picked at random on its side. Nothing
 * grows until `flowers` has run; replaying it changes the seed, so both
 * replant.
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
