/** @format */

import { RefObject } from "react"

import { HIGHLIGHT_FILLS, MODES } from "./constants"

export type FeedMode = (typeof MODES)[number]

export type HighlightFill = (typeof HIGHLIGHT_FILLS)[number]

export type VideoRef = RefObject<HTMLVideoElement | null>

/** sommet de la zone, en coordonnees normalisees (0..1) */
export type Point = { x: number; y: number }

export type FeedProps = {
	src: string
	/** libelle affiche au-dessus du cadre ; Prism porte le sien */
	label?: string
	mode: FeedMode
	asciiCols: number
	highlightColor: string
	tolerance: number
	highlightFill: HighlightFill
	/** polygone applique aux analyses ; vide = toute l'image */
	zone: Point[]
	/** sommets affiches par l'overlay : brouillon pendant le trace */
	overlayPoints: Point[]
	/** vrai pendant le trace : l'overlay capte les clics */
	editingZone: boolean
	/** remonte la couleur choisie a la pipette */
	onPickColor?: (color: string) => void
	/** ajoute un sommet au polygone */
	onAddZonePoint?: (point: Point) => void
	/** deplace un sommet existant */
	onMoveZonePoint?: (index: number, point: Point) => void
}
