/** @format */

import { useEffect, useState, useMemo } from "react"

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
	data: {
		dataSize?: number
		part?: 1 | 2
		speed: number
		reload: number
	}
}

export const useAnim = <T>({
	viewsFn,
	action = () => {},
	transform = ({ view, i }) => ({ view, i }),
	data,
}: UseAnimProps<T>) => {
	let timer
	const [out, setOut] = useState<T>(undefined)
	const [stats, setStats] = useState<Record<string, number>>({})

	const viewsInfo = useMemo(() => viewsFn(), [data.dataSize, data.part])
	const calcSpeed = useMemo(
		() => (data.speed === 0 ? 1 : data.speed),
		[data.speed]
	)

	useEffect(() => {
		const totalView = viewsInfo.views.length

		const timeViews =
			viewsInfo.time1 !== null && viewsInfo.time2 !== null
				? (viewsInfo.time2.getTime() - viewsInfo.time1.getTime()) / 1000
				: undefined
		const nbViewSec = timeViews ? Math.floor(totalView / timeViews) : undefined

		let countView = 0

		clearInterval(timer)

		timer = read<T>(viewsInfo.views, calcSpeed, args => {
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
		})

		return () => {
			clearInterval(timer)
		}
	}, [calcSpeed, data.reload, data.dataSize, data.part])

	return { out, stats }
}
