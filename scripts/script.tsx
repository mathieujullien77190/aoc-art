/** @format */

import { useState } from "react"
import Game2021 from "./game/2021"
import { colors } from "_components/constants"

export const scripts = [
	{
		day: "-1",
		fn: () => {
			return "Test d'une animation du AOC 2021"
		},
	},
]

export const Games = ({ day }: { day: string }) => {
	const [display, setDisplay] = useState<boolean>(true)

	const search = scripts.filter(script => script.day === day)

	return (
		<>
			{display && search.length === 1 && (
				<div
					style={{
						display: "flex",
						position: "fixed",
						justifyContent: "center",
						alignItems: "center",
						top: "24px",
						right: "24px",
						bottom: "24px",
						left: "24px",
						zIndex: 10,
						background: colors.overlay,
						border: `solid 2px ${colors.textColor}`,
						cursor: "pointer",
						overflow: "auto",
					}}
					onClick={() => setDisplay(false)}
				>
					{day === "-1" && <Game2021 />}
				</div>
			)}
		</>
	)
}
