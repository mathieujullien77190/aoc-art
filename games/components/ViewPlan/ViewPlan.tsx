/** @format */

import { ViewPlanProps } from "./types"
import * as S from "./UI"

export const metaText = meta => (
	<S.MetaText>
		<span>{meta.text}</span>
	</S.MetaText>
)

export const ViewPlan = ({
	plans,
	format = str => str,
	getTranslateZ = z => z,
	getColor = () => "white",
	metaComponent = () => <></>,
	className,
	preHighlight = false,
}: ViewPlanProps) => {
	const Pre = <>{}</>

	return (
		<>
			{plans &&
				plans.value.map((viewStr, i) => (
					<S.PlanContainer
						className={className}
						translateZ={getTranslateZ(i)}
						color={getColor(i)}
						key={i}
					>
						{preHighlight ? (
							<S.PreHighlight
								dangerouslySetInnerHTML={{ __html: format(viewStr) }}
							/>
						) : (
							<S.Pre dangerouslySetInnerHTML={{ __html: format(viewStr) }} />
						)}
					</S.PlanContainer>
				))}
			{plans && metaComponent(plans.meta)}
		</>
	)
}
