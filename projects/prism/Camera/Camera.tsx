/** @format */

import { useState } from "react"

import CameraIdInput from "../CameraIdInput"
import ColumnsSwitch from "../ColumnsSwitch"
import Feed from "../Feed"
import HighlightFillSwitch from "../HighlightFillSwitch"
import ModeSwitch from "../ModeSwitch"
import PublicKeyInput from "../PublicKeyInput"
import ToleranceSlider from "../ToleranceSlider"
import ZoneControls from "../ZoneControls"
import {
	DEFAULT_ASCII_COLS,
	DEFAULT_CAMERA_ID,
	DEFAULT_HIGHLIGHT_COLOR,
	DEFAULT_HIGHLIGHT_FILL,
	DEFAULT_HIGHLIGHT_TOLERANCE,
	DEFAULT_PUBLIC_KEY,
	HINT_PICK_COLOR,
} from "../constants"
import { buildStreamUrl } from "../helpers"
import { replacePoint } from "./helpers"
import { FeedMode, HighlightFill, Point } from "../types"
import { CameraProps } from "./types"
import * as S from "./UI"

/** une camera autonome : son flux, ses reglages, sa zone d'analyse */
export const Camera = ({
	label,
	publicKey = DEFAULT_PUBLIC_KEY,
	cameraId = DEFAULT_CAMERA_ID,
	mode = "normal",
	asciiCols = DEFAULT_ASCII_COLS,
	highlightColor = DEFAULT_HIGHLIGHT_COLOR,
	tolerance = DEFAULT_HIGHLIGHT_TOLERANCE,
	highlightFill = DEFAULT_HIGHLIGHT_FILL,
	zone: initialZone = [],
}: CameraProps) => {
	const [currentKey, setCurrentKey] = useState<string>(publicKey)
	const [currentCamera, setCurrentCamera] = useState<string>(cameraId)
	const [currentMode, setCurrentMode] = useState<FeedMode>(mode)
	const [currentCols, setCurrentCols] = useState<number>(asciiCols)
	const [currentColor, setCurrentColor] = useState<string>(highlightColor)
	const [currentTolerance, setCurrentTolerance] = useState<number>(tolerance)
	const [currentFill, setCurrentFill] = useState<HighlightFill>(highlightFill)

	// zone appliquee aux analyses, et brouillon en cours de trace
	const [zone, setZone] = useState<Point[]>(initialZone)
	const [draft, setDraft] = useState<Point[]>([])
	const [editingZone, setEditingZone] = useState<boolean>(false)

	const src = buildStreamUrl(currentKey, currentCamera)

	return (
		<S.Container>
			<S.Title>{label}</S.Title>

			<S.Body>
				<S.Viewer>
					<Feed
						src={src}
						mode={currentMode}
						asciiCols={currentCols}
						highlightColor={currentColor}
						tolerance={currentTolerance}
						highlightFill={currentFill}
						zone={zone}
						overlayPoints={editingZone ? draft : zone}
						editingZone={editingZone}
						onPickColor={setCurrentColor}
						onAddZonePoint={point => setDraft(prev => [...prev, point])}
						onMoveZonePoint={(index, point) =>
							setDraft(prev => replacePoint(prev, index, point))
						}
					/>
				</S.Viewer>

				<S.Settings>
					<PublicKeyInput
						value={currentKey}
						onChange={setCurrentKey}
						disabled={editingZone}
					/>
					<CameraIdInput
						value={currentCamera}
						onChange={setCurrentCamera}
						disabled={editingZone}
					/>
					<ZoneControls
						draftCount={draft.length}
						zoneCount={zone.length}
						editing={editingZone}
						onDraw={() => {
							// on repart de la zone appliquee : Draw sert a la modifier,
							// pas seulement a en tracer une nouvelle
							setDraft(zone)
							setEditingZone(true)
						}}
						onSave={() => {
							setZone(draft)
							setEditingZone(false)
						}}
						onCancel={() => {
							setDraft([])
							setEditingZone(false)
						}}
						onClear={() => setZone([])}
					/>
					<ModeSwitch
						value={currentMode}
						onChange={setCurrentMode}
						disabled={editingZone}
					/>
					{currentMode === "ascii" && (
						<ColumnsSwitch
							value={currentCols}
							onChange={setCurrentCols}
							disabled={editingZone}
						/>
					)}
					{currentMode === "highlight" && (
						<>
							<S.Hint>{HINT_PICK_COLOR}</S.Hint>
							<S.Swatch $color={currentColor}>{currentColor}</S.Swatch>
							<ToleranceSlider
								value={currentTolerance}
								onChange={setCurrentTolerance}
								disabled={editingZone}
							/>
							<HighlightFillSwitch
								value={currentFill}
								onChange={setCurrentFill}
								disabled={editingZone}
							/>
						</>
					)}
				</S.Settings>
			</S.Body>
		</S.Container>
	)
}
