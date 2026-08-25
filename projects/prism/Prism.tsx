/** @format */

import { useState } from "react"

import ColumnsSwitch from "./ColumnsSwitch"
import Feed from "./Feed"
import HighlightFillSwitch from "./HighlightFillSwitch"
import ModeSwitch from "./ModeSwitch"
import PublicKeyInput from "./PublicKeyInput"
import ToleranceSlider from "./ToleranceSlider"
import {
	DEFAULT_ASCII_COLS,
	DEFAULT_HIGHLIGHT_COLOR,
	DEFAULT_HIGHLIGHT_FILL,
	DEFAULT_HIGHLIGHT_TOLERANCE,
	DEFAULT_PUBLIC_KEY,
	LABEL_CAMERA,
	LABEL_SETTINGS,
	HINT_PICK_COLOR,
} from "./constants"
import { buildStreamUrl } from "./helpers"
import { FeedMode, HighlightFill, PrismProps } from "./types"
import * as S from "./UI"

export const Prism = ({
	publicKey = DEFAULT_PUBLIC_KEY,
	mode = "normal",
	asciiCols = DEFAULT_ASCII_COLS,
	highlightColor = DEFAULT_HIGHLIGHT_COLOR,
	tolerance = DEFAULT_HIGHLIGHT_TOLERANCE,
	highlightFill = DEFAULT_HIGHLIGHT_FILL,
}: PrismProps) => {
	const [currentKey, setCurrentKey] = useState<string>(publicKey)
	const [currentMode, setCurrentMode] = useState<FeedMode>(mode)
	const [currentCols, setCurrentCols] = useState<number>(asciiCols)
	const [currentColor, setCurrentColor] = useState<string>(highlightColor)
	const [currentTolerance, setCurrentTolerance] = useState<number>(tolerance)
	const [currentFill, setCurrentFill] = useState<HighlightFill>(highlightFill)

	const src = buildStreamUrl(currentKey)

	return (
		<S.Container>
			<S.Cameras>
				<Feed
					src={src}
					label={LABEL_CAMERA}
					mode={currentMode}
					asciiCols={currentCols}
					highlightColor={currentColor}
					tolerance={currentTolerance}
					highlightFill={currentFill}
					onPickColor={setCurrentColor}
				/>
			</S.Cameras>

			<S.Settings>
				<S.SettingsTitle>{LABEL_SETTINGS}</S.SettingsTitle>
				<PublicKeyInput value={currentKey} onChange={setCurrentKey} />
				<ModeSwitch value={currentMode} onChange={setCurrentMode} />
				{currentMode === "ascii" && (
					<ColumnsSwitch value={currentCols} onChange={setCurrentCols} />
				)}
				{currentMode === "highlight" && (
					<>
						<S.Hint>{HINT_PICK_COLOR}</S.Hint>
						<S.Swatch $color={currentColor}>{currentColor}</S.Swatch>
						<ToleranceSlider
							value={currentTolerance}
							onChange={setCurrentTolerance}
						/>
						<HighlightFillSwitch
							value={currentFill}
							onChange={setCurrentFill}
						/>
					</>
				)}
			</S.Settings>
		</S.Container>
	)
}
