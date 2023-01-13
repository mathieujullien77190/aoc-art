/** @format */
import { useState } from "react"

import { ReloadControlProps } from "./types"

import { Action } from "../Action"
import * as S from "./UI"

export const ReloadControl = ({ onChange }: ReloadControlProps) => {
	const [value, setValue] = useState<number>(1)
	return (
		<S.Line>
			<label>Recharger : </label>
			<span>
				<Action
					onClick={() => {
						setValue(prev => prev + 1)
						onChange(value)
					}}
					value="[Reload]"
				/>
			</span>
		</S.Line>
	)
}
