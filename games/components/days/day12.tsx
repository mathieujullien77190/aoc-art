/** @format */
import { useState } from "react"
import { isMobile } from "react-device-detect"

import { colors } from "_components/constants"

import { ViewPlan } from "_games/helpers/types"
import { mapView, init } from "_games/core/day12"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"
import ViewPlanComponent, { metaText } from "_games/components/ViewPlan"

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)

	const { out, stats } = useAnim<ViewPlan>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init(mapView)
			}, true),
		data: { speed, reload },
	})

	return (
		<WrapperContainer3D>
			<D3
				size={600}
				margin={-100}
				zoom={{ value: isMobile ? 4 : 8, min: 1, max: 20, step: 1, bigStep: 2 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				addControl={[
					{ name: "speed", value: 50, min: 0, max: 1000 },
					{ name: "reload" },
				]}
				start={{ H: 10, V: 300 }}
				onControlChange={(name: string, value) => {
					if (name === "reload") setReload(value)
					if (name === "speed") setSpeed(value)
				}}
			>
				<ViewPlanComponent
					plans={out}
					format={str => str.replace(/(@+)/g, '<span class="H">$1</span>')}
					getColor={z => {
						if (z === 0) return "white"
						if (z === 1) return colors.infoColor
						if (z === 2) return "#e8ffc5"
						if (z === 3) return colors.cmdColor
						return `hsl(28deg, 100%, ${Math.abs((z - 27) * 3 - 19)}%)`
					}}
					getTranslateZ={z => z * 3}
					metaComponent={metaText}
					preHighlight
				/>
			</D3>

			<Stats stats={stats} />
		</WrapperContainer3D>
	)
}

export default Animation
