/** @format */

import AsciiVideo from "../AsciiVideo"
import HighlightVideo from "../HighlightVideo"
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
	onPickColor,
}: FeedProps) => {
	const videoRef = useHlsStream(src)

	return (
		<S.Container>
			<S.Label>{label}</S.Label>
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
						onPick={onPickColor}
					/>
				)}
			</S.Frame>
		</S.Container>
	)
}
