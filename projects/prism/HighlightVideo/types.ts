import { HighlightFill, Point, VideoRef } from "../types"

export type HighlightVideoProps = {
	videoRef: VideoRef
	/** couleur a conserver, au format #rrggbb */
	color: string
	/** ecart de teinte tolere, en degres */
	tolerance: number
	/** rendu des zones retenues : leur couleur, ou des aplats opaques */
	fill: HighlightFill
	/** polygone d'analyse ; vide = toute l'image */
	zone: Point[]
	/** appele au clic, avec la couleur du pixel vise */
	onPick?: (color: string) => void
}
