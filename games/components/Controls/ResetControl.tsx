/** @format */

import { ResetControlProps } from "./types"

import { Action } from "_games/components/Action"
import * as S from "./UI"

export const ResetControl = ({ onChange }: ResetControlProps) => {
	return (
		<S.Line>
			<label>Réinitialiser : </label>
			<span>
				<Action onClick={onChange} value="[Reset]" />
			</span>
		</S.Line>
	)
}
