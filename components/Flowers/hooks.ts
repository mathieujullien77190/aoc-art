import { RefObject, useEffect } from "react"

import { REBUILD_MS, RESIZE_THRESHOLD } from "./constants"
import {
	buildOptions,
	loadFlw,
	plantLeft,
	plantSize,
	viewport,
} from "./helpers"
import { FlwGlobal, FlwPlant, Side, Size } from "./types"

/**
 * Drives a layer: a plant growing from a bottom corner to the top, then
 * stopping once ripe. It reads the container size from its inline style
 * when created, so resizing the window means replanting, hence the delay.
 */
export const useFlowers = (
	containerRef: RefObject<HTMLDivElement>,
	side: Side,
	seed: number
) => {
	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		let stopped = false
		let plant: FlwPlant | null = null
		let planted: Size | null = null
		let timer = 0
		let unlisten = () => {}

		const destroy = () => {
			if (plant) plant._running = false
			plant = null
			container.replaceChildren()
		}

		const build = (flw: FlwGlobal) => {
			destroy()

			const screen = viewport()
			const size = plantSize(screen)

			// the lib reads these two values from the inline style, via parseInt
			container.style.width = `${size.width}px`
			container.style.height = `${size.height}px`
			container.style.left = `${plantLeft(screen, side)}px`

			plant = flw.LimitedFlower.create(
				container,
				buildOptions(flw, screen),
				true
			)
			planted = screen
		}

		loadFlw().then(flw => {
			if (!flw || stopped) return

			build(flw)

			const onResize = () => {
				const screen = viewport()

				// a collapsing address bar is no reason to replant
				const moved =
					!planted ||
					Math.abs(screen.width - planted.width) > RESIZE_THRESHOLD ||
					Math.abs(screen.height - planted.height) > RESIZE_THRESHOLD

				if (!moved) return

				window.clearTimeout(timer)
				timer = window.setTimeout(() => {
					if (!stopped) build(flw)
				}, REBUILD_MS)
			}

			window.addEventListener("resize", onResize)

			unlisten = () => window.removeEventListener("resize", onResize)
		})

		return () => {
			stopped = true
			window.clearTimeout(timer)
			unlisten()
			destroy()
		}
		// the seed changes on each flowers: replant
	}, [containerRef, side, seed])
}
