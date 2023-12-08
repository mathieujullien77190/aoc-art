/** @format */
import { ViewPlan } from "_games/helpers/types"
import { CSSProperties } from "react"

export type ViewPlanProps = {
	plans: ViewPlan
	currentPlan?: number
	format?: (str: string) => string
	getTranslateZ?: (z: number) => number
	getColor?: (z: number) => string
	className?: string
	metaComponent?: (meta: ViewPlan["meta"]) => JSX.Element
	preHighlight?: boolean
	addStyle?: (
		meta: Record<string, string>,
		z: number,
		currentPlan: number
	) => CSSProperties
}
