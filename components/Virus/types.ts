export type Rect = { top: number; left: number; width: number; height: number }

export type VirusProps = {
	/** la fenetre a entierement fondu, il ne reste plus rien a ronger */
	onDead?: () => void
}
