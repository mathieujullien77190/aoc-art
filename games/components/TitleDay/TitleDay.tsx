/** @format */

import { useState } from "react"
import { TitleDayProps } from "./types"

import * as S from "./UI"
import { isMobile } from "react-device-detect"

export const TitleDay = ({
	year,
	day,
	title,
	AOCUrl,
	special,
	onClose,
}: TitleDayProps) => {

	return (
		<>
			<S.Container >
				{!special && (
					<a href={AOCUrl} target="_blank">
						<>
							{year} | jour {day}
						</>
						{!isMobile && (
							<>
								{" "}
								: <span>{title}</span>
							</>
						)}
					</a>
				)}
				{special && "Fonctions..."}
			</S.Container>
			<S.Close onClick={onClose}>✖️</S.Close>
		</>
	)
}
