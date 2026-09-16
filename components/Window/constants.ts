export const FULL = {
	padding: "4px",
	borderSize: "2px",
	fontWeight: "bold",
}

export const LIGHT = {
	padding: "2px",
	borderSize: "1px",
	fontWeight: "normal",
}

export const ANIM_TIME = 300

// gabarit de la fenetre moyenne, en pourcentage du bureau : le poser en
// CSS evite de mesurer le bureau, et la fenetre suit le redimensionnement
export const MEDIUM_MARGIN = 15
export const MEDIUM_SIZE = 70

// gabarit fixe de la fenetre "phone" : portrait, proche d'un ecran de mobile
export const PHONE_WIDTH = "380px"
export const PHONE_HEIGHT = "760px"

// decalage d'une fenetre a l'autre a l'ouverture, en pixels : sans lui
// elles se posent au meme endroit et se masquent parfaitement
export const CASCADE = 26

// etage de la fenetre au premier plan ; les autres descendent d'un cran
// et restent sous les modales, qui sont a 10
export const TOP_LAYER = 9

/**
 * Le cadre de la fenetre : barre de titre, bordure, fond du contenu. Il
 * vivait dans le theme du paquet, qui ne porte plus de fenetre — le faux
 * OS est le seul a en poser, les couleurs le suivent donc ici.
 */
export const WINDOW_COLORS = {
	titleBar: "#ed612e",
	border: "#000000",
	/** le fond derriere le contenu, visible autour de lui */
	content: "#f4ebda",
	text: "#000000",
}

/** un cadre ne veut pas forcement du chasse fixe, mais celui-ci si */
export const WINDOW_FONT = "monospace"
