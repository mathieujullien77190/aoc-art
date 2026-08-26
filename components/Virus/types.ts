/** carre du mot, en pixels ecran */
export type Block = { x: number; y: number; size: number }

/** contamination : croissance par les bords, nettoyage au clic */
export type Spread = {
	step: () => void
	blast: (x: number, y: number) => void
	isFull: () => boolean
}

/** apparition du mot une fois l'ecran couvert */
export type Reveal = {
	/** avance le fondu ; vrai des que le mot est engage */
	update: (now: number, full: boolean) => boolean
}
