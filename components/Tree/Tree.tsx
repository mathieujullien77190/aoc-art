import { useEffect, useRef } from "react"

import * as S from "./UI"

/**
 * A broadleaf tree on the desktop, grown by the generator of the old low-poly
 * workshop, with the birdhouse hung on its trunk. three.js is loaded on
 * mount, in its own chunk: the boot sequence does not wait for it.
 */
export const Tree = () => {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		let cancelled = false
		let stop = () => {}

		import("./scene").then(({ createGarden }) => {
			if (!cancelled && ref.current) stop = createGarden(ref.current)
		})

		return () => {
			cancelled = true
			stop()
		}
	}, [])

	return <S.Canvas ref={ref} aria-hidden="true" />
}
