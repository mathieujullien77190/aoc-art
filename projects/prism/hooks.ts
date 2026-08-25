/** @format */

import { useEffect, useRef } from "react"

import { HLS_MIME } from "./constants"
import { VideoRef } from "./types"

/**
 * Attache un flux HLS a une balise video.
 * Safari lit le HLS nativement ; les autres navigateurs passent par hls.js.
 */
export const useHlsStream = (src: string): VideoRef => {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		if (video.canPlayType(HLS_MIME)) {
			video.src = src
			return
		}

		let hls: { destroy: () => void } | null = null
		let cancelled = false

		// import dynamique : hls.js touche a window, il ne doit pas etre
		// evalue pendant le prerendu statique
		import("hls.js").then(({ default: Hls }) => {
			if (cancelled || !Hls.isSupported()) return
			const instance = new Hls({ liveDurationInfinity: true })
			hls = instance
			instance.loadSource(src)
			instance.attachMedia(video)
		})

		return () => {
			cancelled = true
			if (hls) hls.destroy()
		}
	}, [src])

	return videoRef
}
