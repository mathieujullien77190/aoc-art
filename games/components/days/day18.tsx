/** @format */

import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"

import { colors } from "_components/constants"

import { data, getAllPlan, volcano, searchInsideCube } from "_games/core/day18"

import D3 from "_games/components/D3"
import { WrapperContainer3D } from "_games/components/Containers"
import ViewPlanComponent from "_games/components/ViewPlan"

import { ViewPlan } from "_games/helpers/types"

const CustomViewPlanComponent = styled(ViewPlanComponent)`
	&.zCurrent {
		border: solid 1px white;

		pre {
			opacity: 1;
			color: ${colors.importantColor};
		}
	}

	pre {
		margin: 0;
		color: ${colors.textColor};
		opacity: 0.2;

		span.in {
			color: ${colors.infoColor};
		}

		span.out {
			color: ${colors.restrictedColor};
		}
	}
`

const Volcano = styled.pre`
	position: absolute;
	bottom: 10px;
	right: 10px;

	margin: 0;

	span {
		opacity: 0.4;
	}

	span.text {
		opacity: 1;
	}

	span.in {
		color: ${colors.infoColor};
	}

	span.target {
		opacity: 1;
		color: ${colors.importantColor};
	}
`

const Animation = () => {
	const [color, setColor] = useState<number>(9)
	const [basePlan, setBasePlan] = useState<ViewPlan>()

	const handleClick = useCallback(e => {
		e.preventDefault()
		setColor(prev => (prev + 1 > 19 ? -1 : prev + 1))
	}, [])

	useEffect(() => {
		const test = searchInsideCube(data)

		setBasePlan(getAllPlan(data.base, test.inside, test.outside, data.limits))
	}, [])

	return (
		<WrapperContainer3D onContextMenu={handleClick}>
			<D3
				size={{ width: 400, height: 400 }}
				control={{
					mouse: { activate: true, smoothing: 400, speed: 3 },
					keyboard: true,
					UI: true,
				}}
				start={{ H: 20, V: 130 }}
				addControl={[
					{
						name: "slider",
						label: "Mettre en évidence",
						min: 0,
						max: data.limits.zMax - 1,
						step: 1,
						unit: "",
						value: color,
					},
				]}
				onControlChange={(name, value) => {
					if (name === "slider") setColor(value.value)
				}}
			>
				<CustomViewPlanComponent
					currentPlan={color}
					plans={basePlan}
					format={str =>
						str
							.replace(/(\.+)/g, '<span class="out">$1</span>')
							.replace(/(\x+)/g, '<span class="in">$1</span>')
					}
					getTranslateZ={z => z * 10 - 100}
				/>
			</D3>

			<Volcano dangerouslySetInnerHTML={{ __html: volcano }} />
		</WrapperContainer3D>
	)
}

export default Animation
