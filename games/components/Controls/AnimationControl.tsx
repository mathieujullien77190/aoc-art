/** @format */
import { useEffect, useState } from "react"

import { AnimationControlProps, AnimationValue } from "./types"

import { Action } from "_games/components/Action"
import * as S from "./UI"

const limitSpeed = (speed: number): number => {
	if (speed < 0) return 0
	if (speed > 1000) return 1000
	return speed
}

const speedDisplay = (baseSpeed: number, speed: number): string => {
	const txt = ""
	if (speed === 1000) return `${txt} min`
	if (speed === 0) return `${txt} max`
	return `${txt} ${Math.floor((baseSpeed / speed) * 100) / 100}`
}

const bigStep = 50
const step = 5

export const AnimationControl = ({
	onChange,
	speed = 40,
	pause = false,
	reload = 1,
}: AnimationControlProps) => {
	const [startValue] = useState<AnimationValue>({
		speed: speed,
		reload: reload,
		pause: pause,
	})

	return (
		<S.Line>
			<label>
				Animation : ( {pause ? "pause" : "play"} |{" "}
				{speedDisplay(startValue.speed, speed)} )
			</label>
			<span>
				<Action
					onClick={() => {
						const calcSpeed = limitSpeed(speed + bigStep)
						onChange({ reload: reload, speed: calcSpeed, pause })
					}}
					value="<<"
				/>
				<Action
					onClick={() => {
						const calcSpeed = limitSpeed(speed + step)
						onChange({ reload: reload, speed: calcSpeed, pause })
					}}
					value="<"
				/>
				<Action
					onClick={() => {
						onChange({ reload: reload + 1, speed, pause })
					}}
					value="🗘"
				/>
				<Action
					onClick={() => {
						onChange({ reload: reload, speed, pause: !pause })
					}}
					value={pause ? "▷" : "‖"}
				/>
				<Action
					onClick={() => {
						const calcSpeed = limitSpeed(speed - step)
						onChange({ reload: reload, speed: calcSpeed, pause })
					}}
					value=">"
				/>
				<Action
					onClick={() => {
						const calcSpeed = limitSpeed(speed - bigStep)
						onChange({ reload: reload, speed: calcSpeed, pause })
					}}
					value=">>"
				/>
			</span>
		</S.Line>
	)
}
