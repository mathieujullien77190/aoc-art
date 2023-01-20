/** @format */
import { ViewPlan } from "_games/helpers/types"

export type ViewPlanProps = {
	plans: ViewPlan
	currentPlan?: number
	format?: (str: string) => string
	getTranslateZ?: (z: number) => number
	getColor?: (z: number) => string
	className?: string
	metaComponent?: (meta: ViewPlan["meta"]) => JSX.Element
	preHighlight?: boolean
}
