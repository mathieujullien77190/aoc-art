import React, { ReactNode } from "react"

import { Box, Rect } from "./types"
import { BOX_HEIGHT, BOX_MARGIN, BOX_WIDTH, PADDING, STORAGE_KEY } from "./constants"

import { getStorage, setStorage } from "../helpers/localStorage"

/** vue une fois, la visite ne se rouvre plus toute seule */
export const hasSeen = (): boolean => Boolean(getStorage(STORAGE_KEY))

export const markSeen = () => setStorage(STORAGE_KEY, true)

import * as S from "./UI"

/**
 * Position de l'element marque. Plusieurs elements peuvent porter la meme
 * marque, une commande jouee deux fois par exemple : le dernier est celui
 * que le visiteur vient de voir passer.
 */
export const readRect = (target: string): Rect | null => {
	const nodes = document.querySelectorAll(`[data-tutorial="${target}"]`)
	const node = nodes[nodes.length - 1] as HTMLElement | undefined
	if (!node) return null

	const box = node.getBoundingClientRect()
	if (box.width === 0 || box.height === 0) return null

	// sorti de l'ecran, le shell a defile : rien a designer
	if (box.bottom < 0 || box.right < 0) return null
	if (box.top > window.innerHeight || box.left > window.innerWidth) return null

	return { top: box.top, left: box.left, width: box.width, height: box.height }
}

export const sameRect = (a: Rect | null, b: Rect | null): boolean => {
	if (a === null || b === null) return a === b

	return (
		Math.round(a.top) === Math.round(b.top) &&
		Math.round(a.left) === Math.round(b.left) &&
		Math.round(a.width) === Math.round(b.width) &&
		Math.round(a.height) === Math.round(b.height)
	)
}

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max)

/**
 * La bulle se pose sous la cible, ou au-dessus si le bas de l'ecran est
 * trop court, et reste dans la fenetre. Sans cible, elle se centre.
 */
export const placeBox = (rect: Rect | null): Box => {
	const width = Math.min(BOX_WIDTH, window.innerWidth - 2 * BOX_MARGIN)

	if (!rect) {
		return {
			top: Math.max(BOX_MARGIN, (window.innerHeight - BOX_HEIGHT) / 2),
			left: (window.innerWidth - width) / 2,
			width,
		}
	}

	const below = rect.top + rect.height + PADDING + BOX_MARGIN
	const above = rect.top - PADDING - BOX_MARGIN - BOX_HEIGHT

	const fitsBelow = below + BOX_HEIGHT + BOX_MARGIN < window.innerHeight
	const top = fitsBelow || above < BOX_MARGIN ? below : above

	const centered = rect.left + rect.width / 2 - width / 2

	return {
		top: clamp(top, BOX_MARGIN, window.innerHeight - BOX_HEIGHT - BOX_MARGIN),
		left: clamp(centered, BOX_MARGIN, window.innerWidth - width - BOX_MARGIN),
		width,
	}
}

/** les portions entre accents graves sont des bouts de commande */
export const format = (text: string): ReactNode =>
	text
		.split("`")
		.map((part, index) =>
			index % 2 === 1 ? (
				<S.Key key={index}>{part}</S.Key>
			) : (
				<React.Fragment key={index}>{part}</React.Fragment>
			)
		)
