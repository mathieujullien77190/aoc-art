/**
 * The shell window frame. The mask sits on it: holes follow the window
 * without us tracking it.
 */
export const TARGET = '[data-window="shell"]'

/** side of a lost cell, in pixels */
export const PIXEL_SIZE = 40

/** time between two losses, in ms */
export const TICK_MS = 35

/** weight of the neighbour below in the spread: 1 for no bias */
export const DOWN_BIAS = 2
