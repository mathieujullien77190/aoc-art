/** @format */

import { RefObject } from "react"

import { HIGHLIGHT_FILLS, MODES } from "./constants"

export type FeedMode = (typeof MODES)[number]

export type HighlightFill = (typeof HIGHLIGHT_FILLS)[number]

export type VideoRef = RefObject<HTMLVideoElement | null>

export type PrismProps = {
	/** cle publique initiale ; modifiable ensuite via l'input */
	publicKey?: string
	/** mode de rendu initial */
	mode?: FeedMode
	/** largeur du rendu ascii, en caracteres */
	asciiCols?: number
	/** couleur conservee par le mode highlight */
	highlightColor?: string
	/** ecart de teinte tolere, en degres */
	tolerance?: number
	/** rendu des zones retenues */
	highlightFill?: HighlightFill
}

export type FeedProps = {
	src: string
	label: string
	mode: FeedMode
	asciiCols: number
	highlightColor: string
	tolerance: number
	highlightFill: HighlightFill
	/** remonte la couleur choisie a la pipette */
	onPickColor?: (color: string) => void
}
