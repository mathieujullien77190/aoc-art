import { ViewPlanProps } from "./types"
import * as S from "./UI"

export const metaText = meta => (
	<S.MetaText>
		<span>{meta.text}</span>
	</S.MetaText>
)

export const metaTextIndex = meta => (
	<S.MetaTextIndex>
		<span>Index : {meta.index}</span>
	</S.MetaTextIndex>
)

export const ViewPlan = ({
	plans,
	format = str => str,
	getTranslateZ = z => z,
	getColor = () => "white",
	metaComponent = () => <></>,
	addStyle = () => ({}),
	currentPlan = 0,
	className,
	preHighlight = false,
}: ViewPlanProps) => {
	return (
		<>
			{plans &&
				plans.value.map((viewStr, i) => (
					<S.PlanContainer
						className={
							className + ` z${i} ` + (i === currentPlan ? "zCurrent" : "")
						}
						$translateZ={getTranslateZ(i)}
						$color={getColor(i)}
						key={i}
						style={addStyle(plans.meta, i, currentPlan)}
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
