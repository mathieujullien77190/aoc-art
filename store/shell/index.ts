import type { ShellControls, ShellState } from "flower-shell"

/** Name under which the page's terminal is reachable; only one lives here. */
export const SHELL_ID = "main"

/**
 * The terminal handle, set by the page on mount. useShell() is a hook,
 * which a command (not a React render) cannot call: it goes through this
 * relay.
 */
let controls: ShellControls | null = null

export const bindShell = (next: ShellControls) => {
	controls = next
}

/** plays a line in the terminal, as if typed */
export const shellRun = (pattern: string) => controls?.run(SHELL_ID, pattern)

/** plays a line the visitor cannot type */
export const shellRunRestricted = (pattern: string) =>
	controls?.runRestricted(SHELL_ID, pattern)

/** frames to wait before giving up on the line */
const WAIT_FRAMES = 10

/**
 * Plays a line even if the terminal was only just requested. A desktop icon
 * opens the window and runs its command in the same click, but the shell
 * registers on the next render and the package throws on an unknown id. So
 * wait for it, a few frames at most.
 */
export const shellRunWhenReady = (pattern: string, left = WAIT_FRAMES) => {
	if (shellState()) {
		shellRun(pattern)
		return
	}

	if (left <= 0) return

	requestAnimationFrame(() => shellRunWhenReady(pattern, left - 1))
}

/**
 * The terminal state, read now: language, options, history. The package
 * throws when no shell has the id; renders read the language, and the whole
 * screen would fall for that, so return nothing instead.
 */
export const shellState = (): ShellState | undefined => {
	try {
		return controls?.actions(SHELL_ID)
	} catch {
		return undefined
	}
}
