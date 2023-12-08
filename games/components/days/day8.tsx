/** @format */
import { useState } from "react"
import { isMobile } from "react-device-detect"
import styled from "styled-components"

import { ViewPlan } from "_games/helpers/types"
import { init } from "_games/core/day8"
import { useAnim, prepareViewsHelpers } from "_games/components/hooks"

import D3 from "_games/components/D3"
import Stats from "_games/components/Stats"
import { WrapperContainer3D } from "_games/components/Containers"
import ViewPlanComponent, { metaTextIndex } from "_games/components/ViewPlan"
import { AnimationValue } from "_games/components/Controls"

const CustomViewPlanComponent = styled(ViewPlanComponent)`
	&.z1 {
		transform: rotateY(0deg) rotateZ(0deg) rotateX(0deg);
	}
	&.z2 {
		transform: rotateY(0deg) rotateZ(0deg) rotateX(0deg);
	}

	pre {
		line-height: 20px;

		span.red {
			color: red;
		}

		span.green {
			color: green;
		}

		span.yellow {
			color: yellow;
		}

		span.white {
			color: white;
		}
	}
`

const Animation = () => {
	const [speed, setSpeed] = useState<number>(40)
	const [reload, setReload] = useState<number>(0)
	const [pause, setPause] = useState<boolean>(false)

	const { out, stats } = useAnim<ViewPlan>({
		viewsFn: () =>
			prepareViewsHelpers(() => {
				return init()
			}, true),
		control: { pause, reload, speed },
	})

	return (
		<WrapperContainer3D>
			<D3
				size={{ width: 1000, height: 600 }}
				margin={-100}
				zoom={{ value: isMobile ? 4 : 8, min: 1, max: 20, step: 1, bigStep: 2 }}
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
				start={{ H: 30, V: 330 }}
				onControlChange={(name: string, value) => {
					if (name === "animation") {
						setSpeed((value as AnimationValue).speed)
						setReload((value as AnimationValue).reload)
						setPause((value as AnimationValue).pause)
					}
				}}
			>
				<CustomViewPlanComponent
					plans={out}
					format={str =>
						str
							.replace(/(#+)/g, '<span class="red">$1</span>')
							.replace(/(AAA)/g, '<span class="green">$1</span>')
							.replace(/(ZZZ)/g, '<span class="yellow">$1</span>')
							.replace(/(X+)/g, '<span class="white">$1</span>')
							.replace(/\+(.*)\+/g, '<span class="yellow">$1</span>')
					}
					getColor={z => {
						if (z === 0) return "#636363"
						if (z === 1) return "#ffab2c"
						if (z === 2) return "#636363"
						return "#ffd99f"
					}}
					getTranslateZ={z => (z > 0 ? (z - 3) * 15 : 0)}
					preHighlight
					metaComponent={metaTextIndex}
					addStyle={(meta, z) => {
						if (z === 1) return { transform: `translateZ(${+meta.y * 20}px)` }
						if (z === 2) return { transform: `translateZ(-400px) scale(0.9)` }
						return {}
					}}
				/>
			</D3>

			<Stats stats={stats} />
		</WrapperContainer3D>
	)
}

export default Animation
