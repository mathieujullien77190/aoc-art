import { ACTION_RELOAD, LABEL_STREAM } from "../constants"
import { ReloadButtonProps } from "./types"
import * as S from "./UI"

/** reconstruit le flux : utile si l'image se fige malgre la reprise auto */
export const ReloadButton = ({
	onClick = () => {},
	disabled = false,
}: ReloadButtonProps) => (
	<S.Container>
		<S.Text>{LABEL_STREAM}</S.Text>
		<S.Button type="button" disabled={disabled} onClick={onClick}>
			{ACTION_RELOAD}
		</S.Button>
	</S.Container>
)
