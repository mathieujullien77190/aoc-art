/** @format */

export type InputProps = {
	value?: string
	options: { lang: string; animation: boolean; keyboardOnFocus: boolean }
	onValidate?: (commandPattern: string) => void
	onCallPrevious?: () => void
	onCallNext?: () => void
}
