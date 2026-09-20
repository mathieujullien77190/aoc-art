export type Rect = { top: number; left: number; width: number; height: number }

export type VirusProps = {
	/** the window has melted entirely, nothing left to gnaw */
	onDead?: () => void
}
