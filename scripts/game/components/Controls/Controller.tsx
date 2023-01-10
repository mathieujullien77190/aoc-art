/** @format */

import React, { useState, useRef } from "react"

import { SpeedControl } from "./SpeedControl"
import { DataControl } from "./DataControl"
import { HelpControl } from "./HelpControl"
import { ResetControl } from "./ResetControl"
import { ZoomControl } from "./ZoomControl"
import { RotationControl } from "./RotationControl"
import { ControllerProps } from "./types"
import { useGetBottom } from "./hooks"

import * as S from "./UI"

export const Controller = ({
	controls,
	children,
	onChange,
}: ControllerProps) => {
	const [show, setShow] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null)
	const bottom = useGetBottom(ref)

	return (
		<S.ControllerContainer bottom={bottom} show={show} ref={ref}>
			<S.Title
				onClick={() => {
					setShow(prev => !prev)
				}}
			>
				PANNEAU DE CONTROLE
			</S.Title>

			{controls
				.filter(item => !!item)
				.map((control, i) => (
					<React.Fragment key={control.name + i}>
						{control.name === "speed" && (
							<SpeedControl
								value={control.value}
								min={control.min}
								max={control.max}
								onChange={value => onChange(control.name, value)}
							/>
						)}
						{control.name === "data" && (
							<DataControl
								value={control.value}
								min={control.min}
								max={control.max}
								onChange={value => onChange(control.name, value)}
							/>
						)}
						{control.name === "help" && <HelpControl />}
						{control.name === "reset" && (
							<ResetControl onChange={() => onChange(control.name, null)} />
						)}
						{control.name === "rotation" && (
							<RotationControl
								value={control.value}
								type={control.type}
								onChange={value => onChange(control.name + control.type, value)}
							/>
						)}
						{control.name === "zoom" && (
							<ZoomControl
								value={control.value}
								min={control.min}
								max={control.max}
								onChange={value => onChange(control.name, value)}
							/>
						)}
					</React.Fragment>
				))}
			{children}
		</S.ControllerContainer>
	)
}
