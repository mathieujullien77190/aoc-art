/** @format */

export type InputProps = {
	value?: string
	onValidate?: (commandPattern: string) => void
	onCallPrevious?: () => void
	onCallNext?: () => void
}
