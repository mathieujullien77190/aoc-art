export type IconProps = {
	name: string
	image: string
	open: boolean
	/**
	 * The icon keeps the click state locally while the parent catches up. An
	 * icon that opens nothing skips it, or it would stay lit.
	 */
	latch?: boolean
	onClick?: (name: string) => void
}
