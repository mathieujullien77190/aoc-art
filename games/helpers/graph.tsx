/** @format */

export type Element = { name: string; value: number }
export type ElementGraph = { value: number; from: string; view: boolean }

export const dijkstra = (
	start: Element,
	canGo: (Element: string) => Element[],
	debug: (
		ElementGraph: Record<string, ElementGraph>,
		index: number
	) => void = () => {}
): Record<string, ElementGraph> => {
	let index = 0
	let listToGo: Element[]
	let min: Element
	let list: Record<string, ElementGraph>
	let current: Element

	list = {
		[start.name]: { value: start.value, from: start.name, view: true },
	}
	current = start
	listToGo = canGo(start.name)
	do {
		min = { name: null, value: Number.MAX_VALUE }

		listToGo.forEach(item => {
			const d = item.value + current.value
			const itemList = list[item.name]

			if (itemList === undefined || (d > itemList.value && !itemList.view))
				list[item.name] = { value: d, from: current.name, view: false }
		})

		for (let key in list) {
			if (list[key].value < min.value && !list[key].view)
				min = { name: key, value: list[key].value }
		}

		if (min.name) {
			current = min
			list[current.name].view = true
			listToGo = canGo(current.name)
		}
		debug(list, index++)
	} while (min.name)

	return list
}

export const findBestPath = (
	start: string,
	end: string,
	canGo: (Element) => Element[],
	debug: (
		ElementGraph: Record<string, ElementGraph>,
		index: number
	) => void = () => {}
) => {
	const startElement = { name: start, value: 0 }
	const res = dijkstra(startElement, canGo, debug)

	let list: string[] = []
	let current = end

	while (current !== start) {
		list.push(current)
		current = res[current].from
	}

	return list
}
