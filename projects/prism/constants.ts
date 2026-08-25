/** @format */

export const DEFAULT_PUBLIC_KEY = "OjVWJxIwdx"

export const STREAM_BASE =
	"https://stream-eu1-bravo.dropcam.com/nexus_aac/b23a48c2a1d64c7cba32bd1ace85d274/playlist.m3u8"

export const MODES = ["normal", "grayscale", "ascii", "highlight"] as const

export const MODE_LABELS = {
	normal: "Normal",
	grayscale: "Grayscale",
	ascii: "ASCII",
	highlight: "Highlight",
}

export const LABEL_CAMERA = "CAMERA 01"
export const LABEL_SETTINGS = "SETTINGS"
export const LABEL_PUBLIC_KEY = "Public key"
export const LABEL_MODE = "Render"
export const LABEL_ASCII_COLS = "Columns"
export const LABEL_HIGHLIGHT_COLOR = "Color"
export const LABEL_TOLERANCE = "Tolerance"
export const LABEL_HIGHLIGHT_FILL = "Fill"
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
