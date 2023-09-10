/** @format */
import {
	viewData0,
	viewData1,
	viewData2,
	viewData3,
	viewArray11,
	viewData11,
	viewData12,
	viewData4,
} from "_games/data/playground"

import {
	createEmptyView,
	copyView,
	createView,
	areEqual,
	clipView,
	extract,
	getNeighbours,
	getChar,
	searchChars,
	searchChar,
	setChar,
	replaceChar,
	iterator,
} from "_games/helpers/view"

export type Story = {
	title: string
	description: string
	id: string
	results: { text: string; exec: () => { base: any; display: any } }[]
}

export const init = (): Story[] => {
	return [
		{
			title: "createView",
			description: "Crée une vue",
			id: "createView",
			results: [
				{
					text: `const str1 = viewData11`,
					exec: () => {
						return {
							base: viewData11,
							display: viewData11,
						}
					},
				},
				{
					text: `const arr = viewArray11`,
					exec: () => {
						return {
							base: viewArray11,
							display: JSON.stringify(viewArray11)
								.replace(/\]\,\[/g, "],\n  [")
								.replace(/\[\[/g, "[\n  [")
								.replace(/\]\]/g, "]\n]"),
						}
					},
				},
				{
					text: `const str2 = viewData12`,
					exec: () => {
						return {
							base: viewData12,
							display: viewData12,
						}
					},
				},
				{
					text: `const view = createView(str1)`,
					exec: () => {
						const view = createView(viewData11)
						return {
							base: view,
							display: view.value,
						}
					},
				},
				{
					text: `const view = createView(arr)`,
					exec: () => {
						const view = createView(viewArray11)
						return {
							base: view,
							display: view.value,
						}
					},
				},
				{
					text: `const view = createView(str2, true)`,
					exec: () => {
						const view = createView(viewData12, true)
						return {
							base: view,
							display: view.value,
						}
					},
				},
			],
		},
		{
			title: "createEmptyView",
			description: "Crée une vue vide",
			id: "createEmptyView",
			results: [
				{
					text: `createEmptyView(\{ width: 10, height: 8 \})`,
					exec: () => {
						const emptyView = createEmptyView({ width: 10, height: 8 })
						return {
							base: emptyView,
							display: emptyView.value,
						}
					},
				},
				{
					text: `createEmptyView(\{ width: 10, height: 8 \}, ".")`,
					exec: () => {
						const emptyView = createEmptyView({ width: 10, height: 8 }, ".")
						return {
							base: emptyView,
							display: emptyView.value,
						}
					},
				},
			],
		},
		{
			title: "copyView",
			description: "Crée une copie d'une vue",
			id: "copyView",
			results: [
				{
					text: `const data = viewData1`,
					exec: () => {
						return {
							base: viewData1,
							display: viewData1,
						}
					},
				},
				{
					text: `const view = createView(data)`,
					exec: () => {
						const view = createView(viewData1)
						return {
							base: view,
							display: view.value,
						}
					},
				},
				{
					text: `const copy = copyView(view)`,
					exec: () => {
						const view = copyView(createView(viewData1))
						return {
							base: view,
							display: view.value,
						}
					},
				},
			],
		},
		{
			title: "areEqual",
			description: "Compare deux vues",
			id: "areEqual",
			results: [
				{
					text: `const view1 = createView(viewData1)`,
					exec: () => {
						const view1 = createView(viewData1)
						return {
							base: view1,
							display: view1.value,
						}
					},
				},
				{
					text: `const view2 = createView(viewData2)`,
					exec: () => {
						const view2 = createView(viewData2)
						return {
							base: view2,
							display: view2.value,
						}
					},
				},
				{
					text: `const view3 = createView(viewData3)`,
					exec: () => {
						const view3 = createView(viewData3)
						return {
							base: view3,
							display: view3.value,
						}
					},
				},
				{
					text: `areEqual(view1, view2)`,
					exec: () => {
						const equal = areEqual(createView(viewData1), createView(viewData2))
						return {
							base: equal,
							display: equal ? "true" : "false",
						}
					},
				},
				{
					text: `areEqual(view2, view3)`,
					exec: () => {
						const equal = areEqual(createView(viewData2), createView(viewData3))
						return {
							base: equal,
							display: equal ? "true" : "false",
						}
					},
				},
			],
		},
		{
			title: "clipView",
			description:
				"Extrait une partie d'une vue par rapport à un point central",
			id: "clipView",
			results: [
				{
					text: `const view1 = createView(viewData1)`,
					exec: () => {
						const view1 = createView(viewData1)
						return {
							base: view1,
							display: view1.value,
						}
					},
				},
				{
					text: `const clip1 = clipView(view, { x: 4, y: 2 }, 1, "x")`,
					exec: () => {
						const view = createView(viewData1)
						const clip = clipView(view, { x: 4, y: 2 }, 1, "x")
						return {
							base: clip,
							display: clip.value,
						}
					},
				},
				{
					text: `const clip2 = clipView(view, { x: 4, y: 2 }, 5, "x")`,
					exec: () => {
						const view = createView(viewData1)
						const clip = clipView(view, { x: 4, y: 2 }, 5, "x")
						return {
							base: clip,
							display: clip.value,
						}
					},
				},
				{
					text: `const clip3 = clipView(view, { x: 0, y: 0 }, 3, "x")`,
					exec: () => {
						const view = createView(viewData1)
						const clip = clipView(view, { x: 0, y: 0 }, 3, "x")
						return {
							base: clip,
							display: clip.value,
						}
					},
				},
				{
					text: `const clip4 = clipView(view, { x: 0, y: 0 }, 3)`,
					exec: () => {
						const view = createView(viewData1)
						const clip = clipView(view, { x: 0, y: 0 }, 3)
						return {
							base: clip,
							display: clip.value,
						}
					},
				},
			],
		},
		{
			title: "extract",
			description:
				"Extrait une partie d'une vue par rapport d'un position et d'une taille",
			id: "extract",
			results: [
				{
					text: `const view1 = createView(viewData1)`,
					exec: () => {
						const view1 = createView(viewData1)
						return {
							base: view1,
							display: view1.value,
						}
					},
				},
				{
					text: `const extract1 = extract(view, { x: 0, y: 0 }, { width: 100, height: 100 })`,
					exec: () => {
						const view = createView(viewData1)
						const ext = extract(
							view,
							{ x: 0, y: 0 },
							{ width: 100, height: 100 }
						)
						return {
							base: ext,
							display: ext.value,
						}
					},
				},
				{
					text: `const extract2 = extract(view, { x: 0, y: 0 }, { width: 4, height: 4 })`,
					exec: () => {
						const view = createView(viewData1)
						const ext = extract(view, { x: 0, y: 0 }, { width: 4, height: 4 })
						return {
							base: ext,
							display: ext.value,
						}
					},
				},
				{
					text: `const extract3 = extract(view, { x: 1, y: 1 }, { width: 4, height: 4 })`,
					exec: () => {
						const view = createView(viewData1)
						const ext = extract(view, { x: 1, y: 1 }, { width: 4, height: 4 })
						return {
							base: ext,
							display: ext.value,
						}
					},
				},
			],
		},
		{
			title: "getNeighbours",
			description: "Trouve les voisins (NSEO) d'un caractère dans une vue",
			id: "getNeighbours",
			results: [
				{
					text: `const data = viewData0`,
					exec: () => {
						return {
							base: viewData0,
							display: viewData0,
						}
					},
				},
				{
					text: `neighbours1 = getNeighbours(view, {x:1,y:1})`,
					exec: () => {
						const view = createView(viewData0)
						const neighbours = getNeighbours(view, { x: 1, y: 1 })
						return {
							base: neighbours,
							display: JSON.stringify(neighbours, null, 1),
						}
					},
				},
				{
					text: `neighbours1 = getNeighbours(view, {x:1,y:1}, true)`,
					exec: () => {
						const view = createView(viewData0)
						const neighbours = getNeighbours(view, { x: 1, y: 1 }, true)
						return {
							base: neighbours,
							display: JSON.stringify(neighbours, null, 1),
						}
					},
				},
				{
					text: `neighbours2 = getNeighbours(view, {x:0,y:0})`,
					exec: () => {
						const view = createView(viewData0)
						const neighbours = getNeighbours(view, { x: 0, y: 0 })
						return {
							base: neighbours,
							display: JSON.stringify(neighbours, null, 1),
						}
					},
				},
				{
					text: `neighbours3 = getNeighbours(view, {x:100,y:100})`,
					exec: () => {
						const view = createView(viewData0)
						const neighbours = getNeighbours(view, { x: 100, y: 1000 })
						return {
							base: neighbours,
							display: JSON.stringify(neighbours, null, 1),
						}
					},
				},
			],
		},
		{
			title: "char",
			description:
				"Différentes fonctions pour travailler sur un caractère spécifique",
			id: "char",
			results: [
				{
					text: `const view = createView(viewData1)`,
					exec: () => {
						const view = createView(viewData1)
						return {
							base: view,
							display: view.value,
						}
					},
				},
				{
					text: `const char = getChar(view, {x:4,y:3})`,
					exec: () => {
						const view = createView(viewData1)
						const char = getChar(view, { x: 4, y: 2 })
						return {
							base: char,
							display: char,
						}
					},
				},
				{
					text: `const pos = searchChar(view, "@")`,
					exec: () => {
						const view = createView(viewData1)
						const pos = searchChar(view, "@")
						return {
							base: pos,
							display: JSON.stringify(pos),
						}
					},
				},
				{
					text: `const pos = searchChars(view, "#")`,
					exec: () => {
						const view = createView(viewData1)
						const pos = searchChars(view, "#")
						return {
							base: pos,
							display: JSON.stringify(pos),
						}
					},
				},
				{
					text: `const newView1 = setChar(view, {x:4,y:3}, "X")`,
					exec: () => {
						const view = createView(viewData1)
						const newView = setChar(view, { x: 4, y: 2 }, "X")
						return {
							base: newView,
							display: newView.value,
						}
					},
				},
				{
					text: `const newView2 = replaceChar(view, "#", "$")`,
					exec: () => {
						const view = createView(viewData1)
						const newView = replaceChar(view, "#", "$")
						return {
							base: newView,
							display: newView.value,
						}
					},
				},
			],
		},
		{
			title: "iterator",
			description: "Parcourt une vue ligne par ligne / caractère par caractère",
			id: "iterator",
			results: [
				{
					text: `const view = createView(viewData4)`,
					exec: () => {
						const view = createView(viewData4)
						return {
							base: view,
							display: view.value,
						}
					},
				},
				{
					text: `iterator(view, (pos, value) => {//code})`,
					exec: () => {
						const view = createView(viewData4)
						let res = []
						iterator(view, (pos, value) => {
							res.push({ pos, value })
						})
						return {
							base: res,
							display: JSON.stringify(res, null, 1),
						}
					},
				},
				{
					text: `iterator(view, (pos, value) => {//code}, { x: () => true, y: pos => pos.y === 0 })`,
					exec: () => {
						const view = createView(viewData4)
						let res = []
						iterator(
							view,
							(pos, value) => {
								res.push({ pos, value })
							},
							{ x: () => true, y: pos => pos.y === 0 }
						)
						return {
							base: res,
							display: JSON.stringify(res, null, 1),
						}
					},
				},
			],
		},
	]
}
