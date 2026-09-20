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

// medium window template, in percent of the desktop: in CSS it avoids
// measuring the desktop, and the window follows resizing
export const MEDIUM_MARGIN = 15
export const MEDIUM_SIZE = 70

// fixed template of the "phone" window: portrait, close to a mobile screen
export const PHONE_WIDTH = "380px"
export const PHONE_HEIGHT = "760px"

// offset from one window to the next on opening: without it they land on
// the same spot and hide each other perfectly
export const CASCADE = 26

// layer of the front window; the others drop one notch and stay under
// modals, which are at 10
export const TOP_LAYER = 9

/**
 * The window frame: title bar, border, content background. It used to live
 * in the package theme, which no longer carries a window: the fake OS is
 * the only one to draw them, so the colours follow here.
 */
export const WINDOW_COLORS = {
	titleBar: "#ed612e",
	border: "#000000",
	/** the background behind the content, visible around it */
	content: "#f4ebda",
	text: "#000000",
}

/** a frame does not necessarily want a fixed-width font, but this one does */
export const WINDOW_FONT = "monospace"
