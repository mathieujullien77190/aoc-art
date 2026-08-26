// l'hote n'est pas propre a la camera : plusieurs shards servent les memes flux
export const STREAM_HOST = "https://stream-eu1-bravo.dropcam.com/nexus_aac"

export const MODES = ["normal", "grayscale", "ascii", "highlight", "motion"] as const

// modes qui traitent toute l'image : la zone n'y a pas d'effet
export const ZONELESS_MODES = ["grayscale", "ascii"] as const

export const MODE_LABELS = {
	normal: "Normal",
	grayscale: "Grayscale",
	ascii: "ASCII",
	highlight: "Highlight",
	motion: "Motion",
}

export const LABEL_CAMERA_SOURCE = "Camera"
export const LABEL_MODE = "Render"
export const LABEL_ASCII_COLS = "Columns"
export const LABEL_HIGHLIGHT_COLOR = "Color"
export const LABEL_TOLERANCE = "Tolerance"
export const LABEL_HIGHLIGHT_FILL = "Fill"
export const LABEL_ZONE = "Zone"
export const LABEL_STREAM = "Stream"
export const ACTION_RELOAD = "Reload"
export const ACTION_DRAW_ZONE = "Draw"
export const ACTION_CLEAR_ZONE = "Clear"
export const ACTION_SAVE_ZONE = "Save"
export const ACTION_CANCEL_ZONE = "Cancel"
export const HINT_DRAW_ZONE = "Click the video to add points, then Save"
// un polygone a besoin d'au moins trois sommets
export const ZONE_MIN_POINTS = 3
export const HINT_PICK_COLOR = "Click the video to pick a color"

export const HLS_MIME = "application/vnd.apple.mpegurl"

export const ASCII_RAMP = " .:-=+*#%@"
// cadence des rendus canvas (ascii, highlight)
export const RENDER_FPS = 15

export const ASCII_COLS_OPTIONS = [120, 240, 480]
export const DEFAULT_ASCII_COLS = 240

export const DEFAULT_HIGHLIGHT_COLOR = "#d15f5f"
// ecart de teinte tolere, en degres ; 180 = tout le cercle chromatique
export const DEFAULT_HIGHLIGHT_TOLERANCE = 25
export const TOLERANCE_MIN = 1
export const TOLERANCE_MAX = 180
// en dessous, le pixel est trop gris pour avoir une teinte fiable
export const HIGHLIGHT_MIN_SATURATION = 0.15
// largeur du canvas de traitement ; l'affichage est mis a l'echelle en CSS
export const HIGHLIGHT_WIDTH = 640

// rendu applique aux zones retenues
export const HIGHLIGHT_FILLS = ["color", "blocks"] as const

export const HIGHLIGHT_FILL_LABELS = {
	color: "Color",
	blocks: "Blocks",
}

export const DEFAULT_HIGHLIGHT_FILL = "color"

// grille de la mosaique quand le remplissage est en blocs
export const HIGHLIGHT_BLOCK_COLS = 120
// part minimale de pixels retenus pour qu'une cellule soit remplie
export const HIGHLIGHT_CELL_COVERAGE = 0.25

// grille d'analyse du mouvement
export const MOTION_COLS = 80
// ecart moyen de luminance, par cellule, au dela duquel elle est dite active
export const MOTION_THRESHOLD = 10
// en dessous de ce nombre de cellules, le groupe est ignore (bruit de compression)
export const MOTION_MIN_CELLS = 4
export const MOTION_COLOR = "#77CDF1"

// polygone d'analyse
export const ZONE_COLOR = "#FFCC6A"
export const ZONE_POINT_RADIUS = 3
// tolerance de saisie d'un sommet, en pixels canvas
export const ZONE_HIT_RADIUS = 8

/**
 * Cameras affichees, dans l'ordre. En ajouter une = un bloc de plus.
 * Les zones sont en coordonnees normalisees (0..1), trois decimales
 * suffisent : 0.001 vaut ~0.6 px sur le canvas d'analyse.
 */
export const CAMERAS = [
	{
		label: "CAMERA 01",
		publicKey: "8EvTXEBnos",
		cameraId: "4908fe7443a14f0990743059f2f204f5",
		zone: [
			{ x: 0.475, y: 0.85 },
			{ x: 0.484, y: 0.455 },
			{ x: 0.764, y: 0.438 },
			{ x: 0.75, y: 0.708 },
		],
	},
	{
		label: "CAMERA 02",
		publicKey: "OjVWJxIwdx",
		cameraId: "b23a48c2a1d64c7cba32bd1ace85d274",
		zone: [
			{ x: 0.359, y: 0.546 },
			{ x: 0.932, y: 0.479 },
			{ x: 0.938, y: 0.652 },
			{ x: 0.376, y: 0.73 },
		],
	},
]

// chien de garde : un flux live fige ne remonte pas toujours d'erreur,
// on surveille donc l'avancee de la lecture
export const STALL_CHECK_MS = 2000
export const STALL_TICKS = 3

// etat du flux : la lecture doit avancer ET l'image ne pas etre noire
export const STATUS_CHECK_MS = 2000
// echantillon minuscule : on ne juge qu'une moyenne, pas un detail
export const STATUS_SAMPLE_WIDTH = 32
// en dessous de cette luminance moyenne, l'image est consideree noire
export const STATUS_MIN_LUMINANCE = 6
export const STATUS_ON = "ON"
export const STATUS_OFF = "OFF"
