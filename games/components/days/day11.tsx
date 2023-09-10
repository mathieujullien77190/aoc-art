/** @format */
import { useState, useEffect } from "react"

import { colors } from "_components/constants"

import { init, data } from "_games/core/day11"

import { ViewPlan } from "_games/helpers/types"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"
import ViewPlanComponent from "_games/components/ViewPlan"
import { AnimationValue } from "_games/components/Controls"

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<ViewPlan>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(data)
			}, true),
		control: { pause, reload, speed },
	})

	return (
		<WrapperContainer3D>
			<D3
				size={{ width: 105, height: 150 }}
				originZ={60}
				margin={-100}
				zoom={{ value: 15, min: 1, max: 20, step: 1, bigStep: 2 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				addControl={[
					{
						name: "animation",
						speed,
						pause,
						reload,
					},
				]}
				start={{ H: 0, V: 0 }}
				onControlChange={(name: string, value) => {
					if (name === "animation") {
						setSpeed((value as AnimationValue).speed)
						setReload((value as AnimationValue).reload)
						setPause((value as AnimationValue).pause)
					}
				}}
			>
				<ViewPlanComponent plans={out} getTranslateZ={z => z * 30} />
			</D3>

			<Stats stats={stats} />
		</WrapperContainer3D>
	)
}

export default Animation
