export type IconProps = {
	name: string
	/** marque visee par la visite guidee */
	tutorial?: string
	image: string
	open: boolean
	onClick?: (name: string) => void
}
