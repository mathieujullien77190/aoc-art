/** @format */

import { useState } from "react"

import CameraSwitch from "../CameraSwitch"
import ColumnsSwitch from "../ColumnsSwitch"
import Feed from "../Feed"
import HighlightFillSwitch from "../HighlightFillSwitch"
import ModeSwitch from "../ModeSwitch"
import ReloadButton from "../ReloadButton"
import ToleranceSlider from "../ToleranceSlider"
import ZoneControls from "../ZoneControls"
import {
	CAMERAS,
	DEFAULT_ASCII_COLS,
	DEFAULT_HIGHLIGHT_COLOR,
	DEFAULT_HIGHLIGHT_FILL,
	DEFAULT_HIGHLIGHT_TOLERANCE,
	HINT_PICK_COLOR,
} from "../constants"
import { buildStreamUrl } from "../helpers"
import { FeedMode, HighlightFill, Point } from "../types"
import { replacePoint } from "./helpers"
import { CameraProps } from "./types"
import * as S from "./UI"

/** un bloc de visionnage : une camera choisie, ses reglages, sa zone */
export const Camera = ({
	index = 0,
	mode = "normal",
	asciiCols = DEFAULT_ASCII_COLS,
	highlightColor = DEFAULT_HIGHLIGHT_COLOR,
	tolerance = DEFAULT_HIGHLIGHT_TOLERANCE,
	highlightFill = DEFAULT_HIGHLIGHT_FILL,
}: CameraProps) => {
	const [current, setCurrent] = useState<number>(index)
	const [currentMode, setCurrentMode] = useState<FeedMode>(mode)
	const [currentCols, setCurrentCols] = useState<number>(asciiCols)
	const [currentColor, setCurrentColor] = useState<string>(highlightColor)
	const [currentTolerance, setCurrentTolerance] = useState<number>(tolerance)
	const [currentFill, setCurrentFill] = useState<HighlightFill>(highlightFill)

	// zone appliquee aux analyses, et brouillon en cours de trace
	const [zone, setZone] = useState<Point[]>(CAMERAS[index].zone)
	const [draft, setDraft] = useState<Point[]>([])
	const [editingZone, setEditingZone] = useState<boolean>(false)

	// incremente pour forcer la reconstruction du flux
	const [reloadKey, setReloadKey] = useState<number>(0)

	const camera = CAMERAS[current]
	const src = buildStreamUrl(camera.publicKey, camera.cameraId)

	/** la zone appartient a la camera : changer de source charge la sienne */
	const selectCamera = (next: number) => {
		setCurrent(next)
		setZone(CAMERAS[next].zone)
		setDraft([])
		setEditingZone(false)
	}

	return (
		<S.Container>
			<S.Title>{camera.label}</S.Title>

			<S.Body>
				<S.Viewer>
					<Feed
						src={src}
						mode={currentMode}
						asciiCols={currentCols}
						highlightColor={currentColor}
						tolerance={currentTolerance}
						highlightFill={currentFill}
						reloadKey={reloadKey}
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
					<CameraSwitch
						value={current}
						onChange={selectCamera}
						disabled={editingZone}
					/>
					<ReloadButton
						onClick={() => setReloadKey(prev => prev + 1)}
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
