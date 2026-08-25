/** @format */

import AsciiVideo from "../AsciiVideo"
import HighlightVideo from "../HighlightVideo"
import MotionVideo from "../MotionVideo"
import ZoneOverlay from "../ZoneOverlay"
import { useHlsStream } from "../hooks"
import { FeedProps } from "../types"
import * as S from "./UI"

/** une camera : un flux HLS, rendu selon le mode choisi */
export const Feed = ({
	src,
	label,
	mode,
	asciiCols,
	highlightColor,
	tolerance,
	highlightFill,
	reloadKey,
	zone,
	overlayPoints,
	editingZone,
	onPickColor,
	onAddZonePoint,
	onMoveZonePoint,
}: FeedProps) => {
	const videoRef = useHlsStream(src, reloadKey)

	return (
		<S.Container>
			{label && <S.Label>{label}</S.Label>}
			<S.Frame $grayscale={mode === "grayscale"}>
				{/* crossOrigin : sans lui le canvas ASCII serait teinte
				    quand Safari lit le HLS nativement */}
				<video
					ref={videoRef}
					muted
					autoPlay
					playsInline
					crossOrigin="anonymous"
				/>
				{mode === "ascii" && (
					<AsciiVideo videoRef={videoRef} cols={asciiCols} />
				)}
				{mode === "highlight" && (
					<HighlightVideo
						videoRef={videoRef}
						color={highlightColor}
						tolerance={tolerance}
						fill={highlightFill}
						zone={zone}
						onPick={onPickColor}
					/>
				)}
				{mode === "motion" && (
					<MotionVideo videoRef={videoRef} zone={zone} />
				)}

				{/* toujours au-dessus ; ne capte les clics que pendant le trace */}
				<ZoneOverlay
					points={overlayPoints}
					editing={editingZone}
					onAddPoint={onAddZonePoint}
					onMovePoint={onMoveZonePoint}
				/>
			</S.Frame>
		</S.Container>
	)
}
