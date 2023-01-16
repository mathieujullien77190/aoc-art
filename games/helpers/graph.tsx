/** @format */

export type Element = { name: string; value: number }
export type ElementGraph = {
	calcValue: number
	value: number
	from: string
	view: boolean
	name: string
}

type DebugReturn = {
	allElements: Record<string, ElementGraph>
	current: ElementGraph
	index: number
}

type DebugFn = ({ allElements, current, index }: DebugReturn) => void

export const dijkstra = (
	start: string,
	canGo: (Element: string) => Element[],
	debug: DebugFn = () => {}
): Record<string, ElementGraph> => {
	let index = 0
	let listToGo: Element[]
	let listView: Record<string, ElementGraph>
	let listNotView: Record<string, ElementGraph>
	let current: ElementGraph
	let minName: string
	let minValue: number

	listView = {
		[start]: {
			name: start,
			calcValue: 0,
			value: 0,
			from: null,
			view: true,
		},
	}
	listNotView = { ...listView }
	current = listView[start]
	listToGo = canGo(start)

	do {
		minName = null
		minValue = Number.MAX_VALUE
		listToGo.forEach(item => {
			const d = item.value + current.calcValue
			const itemListView = listView[item.name]

			if (itemListView) {
				if (d < itemListView.calcValue) listView[item.name].calcValue = d
			} else {
				const itemListNotView = listNotView[item.name]
				if (!itemListNotView) {
					listNotView[item.name] = {
						name: item.name,
						value: item.value,
						calcValue: d,
						from: current.name,
						view: false,
					}
				}
			}
		})

		for (let key in listNotView) {
			if (listNotView[key].calcValue < minValue) {
				minName = key
				minValue = listNotView[key].calcValue
			}
		}

		if (minName) {
			current = listNotView[minName]
			listView[current.name] = current
			delete listNotView[current.name]
			listToGo = canGo(current.name)
		}

		debug({ allElements: listView, current, index: index++ })
	} while (minName)

	return listView
}

export const findBestPath = (
	start: string,
	end: string,
	canGo: (Element) => Element[],
	debug: DebugFn = () => {}
) => {
	const res = dijkstra(start, canGo, debug)

	let list: ElementGraph[] = []
	let current = end

	while (current) {
		list.push(res[current])
		current = res[current].from
	}

	return list
}
