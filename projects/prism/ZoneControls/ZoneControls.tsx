/** @format */

import {
	ACTION_CANCEL_ZONE,
	ACTION_CLEAR_ZONE,
	ACTION_DRAW_ZONE,
	ACTION_SAVE_ZONE,
	HINT_DRAW_ZONE,
	LABEL_ZONE,
	ZONE_MIN_POINTS,
} from "../constants"
import { ZoneControlsProps } from "./types"
import * as S from "./UI"

/**
 * Cycle explicite : Draw ouvre le trace, Save applique. Hors trace la pipette
 * reprend la main sur les clics, sans ambiguite sur l'etat courant.
 */
export const ZoneControls = ({
	draftCount,
	zoneCount,
	editing,
	onDraw = () => {},
	onSave = () => {},
	onCancel = () => {},
	onClear = () => {},
}: ZoneControlsProps) => (
	<S.Container>
		<S.Head>
			{LABEL_ZONE}
			<S.Count>
				{editing
					? `${draftCount} pts`
					: zoneCount
						? `${zoneCount} pts`
						: "full frame"}
			</S.Count>
		</S.Head>

		<S.Buttons>
			{editing ? (
				<>
					<S.Button
						type="button"
						$active
						disabled={draftCount < ZONE_MIN_POINTS}
						onClick={onSave}
					>
						{ACTION_SAVE_ZONE}
					</S.Button>
					<S.Button type="button" $active={false} onClick={onCancel}>
						{ACTION_CANCEL_ZONE}
					</S.Button>
				</>
			) : (
				<>
					<S.Button type="button" $active={false} onClick={onDraw}>
						{ACTION_DRAW_ZONE}
					</S.Button>
					<S.Button
						type="button"
						$active={false}
						disabled={!zoneCount}
						onClick={onClear}
					>
						{ACTION_CLEAR_ZONE}
					</S.Button>
				</>
			)}
		</S.Buttons>

		{editing && <S.Hint>{HINT_DRAW_ZONE}</S.Hint>}
	</S.Container>
)
