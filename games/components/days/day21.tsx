/** @format */
import { useState } from "react"
import { isMobile } from "react-device-detect"
import styled from "styled-components"

import { ViewPlan } from "_games/helpers/types"
import { init } from "_games/core/day21"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"
import ViewPlanComponent from "_games/components/ViewPlan"
import { AnimationValue } from "_games/components/Controls"

const CustomViewPlanComponent = styled(ViewPlanComponent)`
	padding: 5px;

	&.z0 {
		color: #525252;
	}

	&.z1 {
		color: black;
		font-weight: bold;
	}

	pre {
		font-size: 8px;
		line-height: 8px;
	}
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(100)
	const [reload, setReload] = useState<number>(0)
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<ViewPlan>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(64)
			}, true),
		control: { pause, reload, speed },
	})

	return (
		<WrapperContainer3D>
			<D3
				size={{ width: 1000, height: 600 }}
				margin={-100}
				zoom={{ value: isMobile ? 4 : 7, min: 1, max: 20, step: 1, bigStep: 2 }}
				control={{
					mouse: {
						activate: false,
						smoothing: 400,
						speed: 3,
					},
					keyboard: false,
					UI: false,
				}}
				addControl={[
					{
						name: "animation",
						speed,
						pause,
						reload,
					},
				]}
				start={{ H: 0, V: 270 }}
				onControlChange={(name: string, value) => {
					if (name === "animation") {
						setSpeed((value as AnimationValue).speed)
						setReload((value as AnimationValue).reload)
						setPause((value as AnimationValue).pause)
					}
				}}
			>
				<CustomViewPlanComponent plans={out} preHighlight />
			</D3>

			<Stats stats={stats} />
		</WrapperContainer3D>
	)
}

export default Animation
