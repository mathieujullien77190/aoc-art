/**
 * Le cadre de la fenetre du shell. Le masque se pose dessus : les trous
 * suivent donc la fenetre sans qu'on ait a la suivre nous-memes.
 */
export const TARGET = '[data-window="shell"]'

/** cote d'un pixel perdu, en pixels */
export const PIXEL_SIZE = 40

/** duree entre deux pertes, en ms */
export const TICK_MS = 35

/** poids du voisin du dessous dans la propagation : 1 pour aucun biais */
export const DOWN_BIAS = 2
