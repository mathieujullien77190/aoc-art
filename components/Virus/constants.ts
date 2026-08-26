/** @format */

/** cote d'un bloc, en pixels */
export const PIXEL_SIZE = 10

/** duree entre deux vagues, en ms */
export const TICK_MS = 16

/** blocs poses a chaque vague */
export const PER_TICK = 25

/** chance pour mille qu'un foyer apparaisse ailleurs plutot que de s'etendre */
export const NEW_ZONE_CHANCE = 4

/** essais avant d'abandonner la recherche d'une cellule libre */
export const SEED_ATTEMPTS = 30

/** rayon moyen de la zone nettoyee par un clic, en pixels */
export const BLAST_RADIUS = 260

/**
 * Deformation du contour de la zone nettoyee. Le rayon varie selon l'angle,
 * ce qui donne une tache lobee plutot qu'un disque. 0 rend le cercle parfait.
 */
export const BLAST_SHAPE = 0.35

/** finesse de la table des rayons, en echantillons sur le tour complet */
export const SHAPE_SAMPLES = 256

/** mot revele une fois l'ecran entierement noir */
export const MESSAGE_WORD = "REFRESH"

/** attente entre le noir complet et le debut du fondu, en ms */
export const MESSAGE_DELAY_MS = 2000

/** duree du fondu du noir vers le blanc, en ms */
export const MESSAGE_FADE_MS = 2500

/** part de la largeur d'ecran occupee par le mot */
export const MESSAGE_WIDTH_RATIO = 0.6

/** taille d'un glyphe, en pixels de glyphe */
export const GLYPH_COLS = 5
export const GLYPH_ROWS = 7

/** colonnes vides entre deux glyphes */
export const GLYPH_GAP = 1

/** couleur de la contamination */
export const SPREAD_COLOR = "#000000"
