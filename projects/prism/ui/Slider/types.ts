export type SliderProps = {
	label: string
	value: number
	min: number
	max: number
	step?: number
	/** affiche a droite du libelle, ex "25°" */
	display?: string
	onChange?: (value: number) => void
	disabled?: boolean
}
