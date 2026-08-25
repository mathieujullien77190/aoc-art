/** @format */

import { useEffect, useRef } from "react"

import { HLS_MIME, STALL_CHECK_MS, STALL_TICKS } from "./constants"
import { VideoRef } from "./types"

/** sous-ensemble de hls.js reellement utilise ici */
type HlsInstance = {
	destroy: () => void
	startLoad: (position?: number) => void
	recoverMediaError: () => void
}

/**
 * Attache un flux HLS a une balise video.
 * Safari lit le HLS nativement ; les autres navigateurs passent par hls.js.
 *
 * Un flux live peut se figer sans lever d'erreur — le lecteur garde alors sa
 * derniere image, ce qui donne un cadre noir. On ecoute donc les erreurs
 * fatales, et un chien de garde surveille l'avancee de la lecture.
 *
 * `reloadKey` sert a forcer une reconstruction complete depuis l'exterieur.
 */
export const useHlsStream = (src: string, reloadKey = 0): VideoRef => {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		if (video.canPlayType(HLS_MIME)) {
			video.src = src
			video.load()
			return
		}

		let hls: HlsInstance | null = null
		let cancelled = false
		let watchdog = 0

		// import dynamique : hls.js touche a window, il ne doit pas etre
		// evalue pendant le prerendu statique
		import("hls.js").then(({ default: Hls }) => {
			if (cancelled || !Hls.isSupported()) return

			const instance = new Hls({ liveDurationInfinity: true })
			hls = instance

			const resume = () => {
				instance.startLoad(-1)
				video.play().catch(() => {})
			}

			instance.on(Hls.Events.ERROR, (_event, data) => {
				if (!data.fatal) return

				if (data.type === Hls.ErrorTypes.NETWORK_ERROR) instance.startLoad()
				else if (data.type === Hls.ErrorTypes.MEDIA_ERROR)
					instance.recoverMediaError()
				else instance.destroy()
			})

			instance.on(Hls.Events.MANIFEST_PARSED, () => {
				video.play().catch(() => {})
			})

			instance.loadSource(src)
			instance.attachMedia(video)

			let lastTime = -1
			let stalled = 0

			watchdog = window.setInterval(() => {
				if (video.paused || video.seeking) return

				if (video.currentTime !== lastTime) {
					lastTime = video.currentTime
					stalled = 0
					return
				}

				// la lecture n'avance plus : on se recale sur le direct
				stalled++
				if (stalled >= STALL_TICKS) {
					stalled = 0
					resume()
				}
			}, STALL_CHECK_MS)
		})

		return () => {
			cancelled = true
			window.clearInterval(watchdog)
			if (hls) hls.destroy()
		}
	}, [src, reloadKey])

	return videoRef
}
