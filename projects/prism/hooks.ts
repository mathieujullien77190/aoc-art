/** @format */

import { useEffect, useRef } from "react"

import {
	HLS_MIME,
	STALL_CHECK_MS,
	STALL_TICKS,
	STATUS_CHECK_MS,
	STATUS_MIN_LUMINANCE,
	STATUS_SAMPLE_WIDTH,
} from "./constants"
import { frameHeight, luminance } from "./helpers"
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

/**
 * Signale si le flux diffuse quelque chose de visible.
 *
 * Le seul critere est la luminance moyenne : une camera coupee, un flux
 * absent ou une image noire donnent tous le meme resultat a l'ecran, donc
 * le meme verdict. Inutile de distinguer les causes.
 *
 * `onChange` doit etre stable — un setter de useState convient.
 */
export const useStreamStatus = (
	videoRef: VideoRef,
	onChange: (on: boolean) => void
) => {
	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		// echantillon minuscule : on ne juge qu'une moyenne, pas un detail
		const canvas = document.createElement("canvas")
		canvas.width = STATUS_SAMPLE_WIDTH
		canvas.height = frameHeight(STATUS_SAMPLE_WIDTH)
		const ctx = canvas.getContext("2d", { willReadFrequently: true })

		let previous: boolean | null = null

		const check = () => {
			let on = false

			// HAVE_CURRENT_DATA : sans image a lire, le flux est eteint
			if (ctx && video.readyState >= 2) {
				try {
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
					const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

					let total = 0
					for (let i = 0; i < data.length; i += 4)
						total += luminance(data[i], data[i + 1], data[i + 2])

					on = total / (data.length / 4) > STATUS_MIN_LUMINANCE
				} catch {
					// canvas teinte : l'image est illisible, on ne peut pas juger.
					// declarer OFF ici serait un faux negatif
					on = true
				}
			}

			if (on === previous) return
			previous = on
			onChange(on)
		}

		const timer = window.setInterval(check, STATUS_CHECK_MS)
		return () => window.clearInterval(timer)
	}, [videoRef, onChange])
}
