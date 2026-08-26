/** @format */

import { rand } from "_components/ComputerLayout/helpers/math"
import { GLYPH_COLS, GLYPH_GAP, GLYPH_ROWS } from "./constants"
import type { Block } from "./types"

/**
 * Cellule libre tiree au hasard, ou -1 apres trop d'essais.
 *
 * Par rejet plutot que par parcours : tant que la grille est peu remplie on
 * trouve en un ou deux coups, et quand elle est saturee l'echec est le bon
 * resultat — il ne reste alors que de la croissance par les bords.
 */
export const randomFreeCell = (
	filled: Uint8Array,
	attempts: number
): number => {
	for (let i = 0; i < attempts; i++) {
		const cell = rand(0, filled.length - 1)
		if (!filled[cell]) return cell
	}
	return -1
}

export const clamp = (value: number, max: number) =>
	value < 0 ? 0 : value > max ? max : value

/** demarrage et arrivee adoucis, pour un fondu sans a-coup */
export const smoothstep = (progress: number) =>
	progress * progress * (3 - 2 * progress)

/**
 * Table du rayon de la zone nettoyee selon l'angle, echantillonnee une fois.
 *
 * Trois harmoniques de periodes entieres : la table se referme donc sur
 * elle-meme, sans cassure entre le dernier et le premier angle.
 */
export const blastShape = (samples: number, amount: number): Float32Array => {
	const shape = new Float32Array(samples)

	for (let i = 0; i < samples; i++) {
		const angle = (i / samples) * Math.PI * 2
		shape[i] =
			1 +
			amount *
				(Math.sin(angle * 3 + 1.7) * 0.5 +
					Math.sin(angle * 5 + 4.2) * 0.3 +
					Math.sin(angle * 7 + 2.9) * 0.2)
	}

	return shape
}

/** lecture de la table a un angle donne, negatif compris */
export const sampleShape = (shape: Float32Array, angle: number): number => {
	const index = (((angle / (Math.PI * 2)) * shape.length) | 0) + shape.length
	return shape[index % shape.length]
}

/**
 * Fonte 5x7, une chaine par ligne de glyphe, `1` pour un bloc allume.
 *
 * Seules les lettres de MESSAGE_WORD sont decrites : la fonte n'a pas
 * vocation a servir ailleurs.
 */
const GLYPHS: Record<string, string[]> = {
	R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
	E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
	F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
	S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
	H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
}

/**
 * Blocs a peindre pour ecrire le mot au centre de l'ecran.
 *
 * Un pixel de glyphe vaut un carre de `scale` cellules de cote, et les
 * coordonnees sont calees sur la grille : le mot est fait des memes blocs
 * que la contamination, pas de texte pose par-dessus.
 */
export const messageBlocks = (
	word: string,
	width: number,
	height: number,
	pixelSize: number,
	widthRatio: number
): Block[] => {
	const letters = [...word].filter(letter => GLYPHS[letter])
	if (letters.length === 0) return []

	const cellCols =
		letters.length * GLYPH_COLS + (letters.length - 1) * GLYPH_GAP
	const scale = Math.max(
		1,
		Math.floor((width * widthRatio) / (cellCols * pixelSize))
	)

	const size = scale * pixelSize
	// cale sur la grille, sinon les blocs du mot decalent de ceux du fond
	const left = Math.round((width - cellCols * size) / 2 / pixelSize) * pixelSize
	const top =
		Math.round((height - GLYPH_ROWS * size) / 2 / pixelSize) * pixelSize

	const blocks: Block[] = []

	letters.forEach((letter, index) => {
		const originX = left + index * (GLYPH_COLS + GLYPH_GAP) * size

		GLYPHS[letter].forEach((line, row) => {
			for (let col = 0; col < GLYPH_COLS; col++) {
				if (line[col] !== "1") continue
				blocks.push({ x: originX + col * size, y: top + row * size, size })
			}
		})
	})

	return blocks
}
