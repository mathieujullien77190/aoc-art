import { useEffect, useState, useMemo, useRef } from "react"

import { read } from "_games/helpers/view"

export const prepareViewsHelpers = <T>(
	fn: () => T[],
	withTime?: boolean
): { views: T[]; time1?: Date; time2?: Date } => {
	const time1 = new Date()
	const views = fn()
	const time2 = new Date()

	return {
		time1: withTime ? time1 : null,
		views,
		time2: withTime ? time2 : null,
	}
}

type UseAnimProps<T> = {
	viewsFn: () => { views: T[]; time1?: Date; time2?: Date }
	transform?: ({ view, i }: { view: T; i: number }) => {
		view: T
		i: number
	}
	action?: ({ view, i }: { view: T; i: number }) => void
	data?: {
		dataSize?: number
	}
	control?: { pause: boolean; reload: number; speed: number }
}

export const useAnim = <T>({
	viewsFn,
	action = () => {},
	transform = ({ view, i }) => ({ view, i }),
	data = {},
	control = { pause: false, reload: 0, speed: 40 },
}: UseAnimProps<T>) => {
	const [out, setOut] = useState<T>(undefined)
	const [stats, setStats] = useState<Record<string, number>>({})
	const [index, setIndex] = useState<number>(0)
	const [reload, setReload] = useState<number>(control.reload)

	// l'identifiant de l'interval ne sert qu'a l'annuler, jamais au rendu ; en
	// ref il reste a jour pour le nettoyage au demontage, ce qu'un etat capture
	// dans la cloture de l'effet ne garantissait pas
	const timer = useRef<number>(0)

	const viewsInfo = useMemo(() => viewsFn(), [data.dataSize])
	const calcSpeed = useMemo(
		() => (control.speed === 0 ? 1 : control.speed),
		[control.speed]
	)

	useEffect(() => {
		if (control.pause) {
			clearInterval(timer.current)
		}
	}, [control.pause])

	// le retour a l'index 0 part avec l'increment de reload dans le meme lot :
	// l'effet de lecture repart donc bien du debut, comme avant
	useEffect(() => {
		clearInterval(timer.current)
		const restart = window.setTimeout(() => {
			setIndex(0)
			setReload(prev => prev + 1)
		}, 100)

		return () => {
			clearTimeout(restart)
		}
	}, [control.reload])

	useEffect(() => {
		clearInterval(timer.current)
		const restart = window.setTimeout(() => {
			setIndex(0)
			setReload(prev => prev + 1)
		}, 100)

		return () => {
			clearTimeout(restart)
		}
	}, [data.dataSize])

	useEffect(() => {
		const totalView = viewsInfo.views.length

		const timeViews =
			viewsInfo.time1 !== null && viewsInfo.time2 !== null
				? (viewsInfo.time2.getTime() - viewsInfo.time1.getTime()) / 1000
				: undefined
		const nbViewSec = timeViews ? Math.floor(totalView / timeViews) : undefined

		let countView = 0

		clearInterval(timer.current)

		if (!control.pause) {
			timer.current = read<T>(viewsInfo.views, calcSpeed, index, args => {
				const { view, i } = transform(args)

				action(args)
				countView++

				setOut(view)
				setStats({
					timeViews,
					nbViewSec,
					nbsView: countView,
					countView: i + 1,
					totalView,
					dataSize: data.dataSize,
					speed: calcSpeed,
				})

				setIndex(i)

				return true
			})
		}

		return () => {
			clearInterval(timer.current)
		}
	}, [calcSpeed, control.pause, reload])

	return { out, stats }
}
