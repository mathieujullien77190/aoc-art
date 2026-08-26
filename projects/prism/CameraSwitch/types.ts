export type CameraSwitchProps = {
	/** index dans CAMERAS */
	value: number
	onChange?: (index: number) => void
	disabled?: boolean
}
