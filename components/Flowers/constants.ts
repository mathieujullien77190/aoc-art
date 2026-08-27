import { FlwOptions } from "./types"

/**
 * La bibliotheque de Platane, vendorisee dans public : elle se declare en
 * global sur window, il n'y a pas de paquet npm.
 * https://github.com/Platane/Procedural-Flower (MIT)
 */
export const SCRIPT_SRC = "/vendor/flw/Flw.min.js"

/**
 * Attente avant de replanter apres un redimensionnement : la plante se
 * reconstruit de zero, autant ne pas le faire a chaque pixel.
 */
export const REBUILD_MS = 400

/** en dessous de cet ecart, la fenetre n'a pas assez bouge pour replanter */
export const RESIZE_THRESHOLD = 40

/**
 * Largeur visible d'une plante, en pixels. Son canvas fait le double :
 * la lib fait partir la tige du bas au centre, donc la moitie sort de
 * l'ecran pour que la plante pousse pile dans le coin.
 */
export const SPREAD = 420

/**
 * Hauteur gagnee par cran de la tige maitresse, en pixels. Elle sert a
 * deduire maxDeepnessMaster de la hauteur de l'ecran : sans ca la plante
 * s'arrete a mi-chemin au lieu de monter jusqu'en haut. L'ordre de
 * grandeur vient de radius, la courbure fait le reste.
 */
export const MASTER_STEP = 48

/** crans minimum, pour qu'un ecran bas donne quand meme une plante */
export const MASTER_MIN = 8

/**
 * Le reglage greenHill de la demo, aux couleurs pres. Les quatre entrees
 * de couleur sont converties en Flw.Color une fois la lib chargee.
 */
export const COLORS = {
	colorStart: "#153906",
	colorEnd: "#52910b",
	headColor: "#ffcc6a",
	leafColor: "#246410",
}

export const OPTIONS: FlwOptions = {
	widthStart: 4.4,
	widthEnd: 0.8,

	/*
	 * Valeurs du reglage greenHill de la demo. Monter maxDeepness donne
	 * plus de feuilles et maxDeepnessMajor plus de fleurs — la lib pose
	 * une feuille sur un noeud une fois sur cinq, une tete au bout de
	 * chaque branche maitresse — mais l'arbre, construit d'un coup au
	 * demarrage, grossit vite et le rendu devient touffu.
	 */
	maxDeepness: 3,
	maxDeepnessVar: 2,
	maxDeepnessTwisted: 5,
	maxDeepnessTwistedVar: 0,
	maxDeepnessMajor: 2,
	maxDeepnessMajorVar: 2,
	// maxDeepnessMaster est calcule a la volee, il depend de la hauteur
	maxDeepnessMasterVar: 4,
	headSize: 30,
	headSizeVar: 30,
	leafSize: 24,
	leafSizeVar: 8,
	headColorTintVar: 28.3,
	headColorValueVar: 0.168,
	headColorSatVar: 0.11,
	leafColorTintVar: 24.2,
	leafColorValueVar: 0.2,
	leafColorSatVar: 0.2,
	radius: 55,
	radiusVar: 70,
	globalDirection: Math.PI / 2,
	growVelocity: 0.12,
	strokeBranchWidth: 0,
	strokeBranchColor: "#5c5c5c",
	strokeLeafWidth: 0.1,
	strokeLeafColor: "#161616",
	strokeHeadWidth: 0.2,
	strokeHeadColor: "#1b1b1b",
}
