/** @format */

export type ZoneControlsProps = {
	/** sommets du brouillon en cours de trace */
	draftCount: number
	/** sommets de la zone appliquee */
	zoneCount: number
	editing: boolean
	onDraw?: () => void
	onSave?: () => void
	onCancel?: () => void
	onClear?: () => void
}
