/** @format */

import { useState } from "react"
import { TitleDayProps, CloseStyles } from "./types"

import * as S from "./UI"
import { isMobile } from "react-device-detect"

const getPosition = (currentPos: number): CloseStyles => {
	const list = [
		{ top: "10px", right: "10px" },
		{ top: "10px", right: "50%" },
		{ top: "10px", right: "75%" },
		{ top: "10px", right: "25%" },
		{ top: "calc(100% - 30px)", right: "90px" },
	]

	return list[currentPos % list.length]
}

const fuck = 3

export const TitleDay = ({
	year,
	day,
	title,
	AOCUrl,
	special,
	onClose,
	onFuck,
}: TitleDayProps) => {
	const [posClose, setPosClose] = useState<number>(0)

	const showClose = !special || (special && !isMobile)

	return (
		<>
			{title && (
				<S.Container>
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
					{special && <>{title}</>}
				</S.Container>
			)}
			{showClose && (
				<S.Close
					style={{ ...getPosition(posClose) }}
					onMouseEnter={() => {
						if (posClose <= fuck) setPosClose(prev => prev + 1)
					}}
					onClick={() => {
						if (!special) onClose()
						if (special && posClose >= fuck) onFuck()
					}}
				>
					{posClose > fuck ? "🖕" : "✖️"}
				</S.Close>
			)}
		</>
	)
}
