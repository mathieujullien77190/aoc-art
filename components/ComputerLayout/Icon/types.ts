export type IconProps = {
	name: string
	image: string
	open: boolean
	/**
	 * L'icone garde l'etat du clic en local, le temps que le parent suive.
	 * Une icone qui n'ouvre rien s'en passe, sinon elle resterait allumee.
	 */
	latch?: boolean
	onClick?: (name: string) => void
}
