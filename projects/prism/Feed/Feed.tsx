import AsciiVideo from "../AsciiVideo"
import HighlightVideo from "../HighlightVideo"
import MotionVideo from "../MotionVideo"
import ZoneOverlay from "../ZoneOverlay"
import { usesZone } from "../helpers"
import { useHlsStream, useStreamStatus } from "../hooks"
import { FeedProps } from "../types"
import * as S from "./UI"

// defini au niveau module : un litteral par rendu relancerait l'effet
const noop = () => {}

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
	streamOn,
	zone,
	overlayPoints,
	editingZone,
	onPickColor,
	onAddZonePoint,
	onMoveZonePoint,
	onStreamStatus = noop,
}: FeedProps) => {
	const videoRef = useHlsStream(src, reloadKey)

	useStreamStatus(videoRef, onStreamStatus)

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
				{streamOn && mode === "ascii" && (
					<AsciiVideo videoRef={videoRef} cols={asciiCols} />
				)}
				{streamOn && mode === "highlight" && (
					<HighlightVideo
						videoRef={videoRef}
						color={highlightColor}
						tolerance={tolerance}
						fill={highlightFill}
						zone={zone}
						onPick={onPickColor}
					/>
				)}
				{streamOn && mode === "motion" && (
					<MotionVideo videoRef={videoRef} zone={zone} />
				)}

				{/* au-dessus des rendus ; ne capte les clics que pendant le trace */}
				{streamOn && usesZone(mode) && (
					<ZoneOverlay
						points={overlayPoints}
						editing={editingZone}
						onAddPoint={onAddZonePoint}
						onMovePoint={onMoveZonePoint}
					/>
				)}
			</S.Frame>
		</S.Container>
	)
}
