/** @format */

import { MouseEvent, useEffect, useRef } from "react"

import {
	HIGHLIGHT_WIDTH,
	ZONE_COLOR,
	ZONE_HIT_RADIUS,
	ZONE_POINT_RADIUS,
} from "../constants"
import { frameHeight } from "../helpers"
import { Point } from "../types"
import { findVertexAt, toNormalized } from "./helpers"
import { ZoneOverlayProps } from "./types"
import * as S from "./UI"

/** trace le polygone d'analyse et collecte ses sommets */
export const ZoneOverlay = ({
	points,
	editing,
	onAddPoint = () => {},
	onMovePoint = () => {},
}: ZoneOverlayProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	// une ref plutot qu'un state : deplacer un sommet ne doit pas
	// declencher de rendu supplementaire a chaque mousemove
	const dragIndex = useRef<number | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		canvas.width = HIGHLIGHT_WIDTH
		canvas.height = frameHeight(HIGHLIGHT_WIDTH)

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		if (!points.length) return

		const toCanvas = (point: { x: number; y: number }) => ({
			x: point.x * canvas.width,
			y: point.y * canvas.height,
		})

		ctx.strokeStyle = ZONE_COLOR
		ctx.lineWidth = 2
		ctx.beginPath()
		points.forEach((point, index) => {
			const { x, y } = toCanvas(point)
			if (index === 0) ctx.moveTo(x, y)
			else ctx.lineTo(x, y)
		})
		// le polygone ne se ferme qu'a partir de trois sommets
		if (points.length > 2) ctx.closePath()
		ctx.stroke()

		ctx.fillStyle = ZONE_COLOR
		for (const point of points) {
			const { x, y } = toCanvas(point)
			ctx.beginPath()
			ctx.arc(x, y, ZONE_POINT_RADIUS, 0, Math.PI * 2)
			ctx.fill()
		}
	}, [points])

	/** coordonnees normalisees : la zone survit au changement de resolution */
	const toLocal = (event: MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current
		if (!canvas) return null

		return toNormalized(
			canvas.getBoundingClientRect(),
			event.clientX,
			event.clientY
		)
	}

	const findVertex = (position: Point) => {
		const canvas = canvasRef.current
		if (!canvas) return -1

		// le rayon est en pixels canvas : on le ramene en normalise
		return findVertexAt(
			points,
			position,
			ZONE_HIT_RADIUS / canvas.width,
			ZONE_HIT_RADIUS / canvas.height
		)
	}

	const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
		const position = toLocal(event)
		if (!position) return

		// saisir un sommet existant prime sur l'ajout d'un nouveau
		const hit = findVertex(position)
		if (hit >= 0) {
			dragIndex.current = hit
			return
		}

		onAddPoint(position)
	}

	const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
		if (dragIndex.current === null) return

		const position = toLocal(event)
		if (position) onMovePoint(dragIndex.current, position)
	}

	const stopDrag = () => {
		dragIndex.current = null
	}

	return (
		<S.Canvas
			ref={canvasRef}
			$editing={editing}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={stopDrag}
			onMouseLeave={stopDrag}
		/>
	)
}
