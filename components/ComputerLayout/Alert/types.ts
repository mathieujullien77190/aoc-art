export type Pos = { x: number; y: number }

export type AlertButton = {
	label: string
	onClick: () => void
	/** le bouton s'ecarte au premier survol, puis se laisse cliquer */
	dodge?: boolean
}

export type AlertProps = {
	show: boolean
	message: string
	buttons: AlertButton[]
	/** position absolue ; centree dans le bureau si absente */
	pos?: Pos
	onClose?: () => void
}
