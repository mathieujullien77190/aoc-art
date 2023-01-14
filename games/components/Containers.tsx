/** @format */

import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

export const WrapperContainer = styled.div`
	margin-top: 20px;
	height: calc(100% - 64px);
	display: flex;
	align-items: center;
	justify-content: center;
`

export const WrapperContainer3D = styled.div`
	margin: 0;
	height: 100%;
	overflow: hidden;
`

export const GameContainer = styled.div<{ scale: number }>`
	margin: 0;
	transform: ${({ scale }) => `scale(${scale})`};
`

type WrapperProps = {
	game: JSX.Element
	children: JSX.Element
	debounce: number
}

export const Wrapper = ({ game, children, debounce }: WrapperProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const gameRef = useRef<HTMLDivElement>(null)
	const [scale, setScale] = useState<number>(1)
	useEffect(() => {
		const timer = window.setTimeout(() => {
			if (wrapperRef.current && gameRef.current) {
				const wrapperDim = wrapperRef.current.getBoundingClientRect()
				const gameDim = gameRef.current.getBoundingClientRect()

				const scaleX =
					wrapperDim.width / gameDim.width < 1
						? wrapperDim.width / gameDim.width
						: 1
				const scaleY =
					wrapperDim.height / gameDim.height < 1
						? wrapperDim.height / gameDim.height
						: 1

				setScale(Math.min(scaleX, scaleY))
			}
		}, debounce)

		return () => {
			clearTimeout(timer)
		}
	}, [])

	return (
		<WrapperContainer ref={wrapperRef}>
			<GameContainer ref={gameRef} scale={scale}>
				{game}
			</GameContainer>
			{children}
		</WrapperContainer>
	)
}
