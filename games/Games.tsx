import { useState } from "react"

import { runRestricted } from "retro-shell"

import { gamesConfig } from "./constants"

import Window from "./components/Window"

export const Games = ({ day, year }: { day: string, year: string }) => {
	const [display, setDisplay] = useState<boolean>(true)

	const search = gamesConfig.filter(script => script.day === day && script.year === year)

	return (
		<>
			{display && search.length === 1 && (
				<Window
					game={search[0]}
					onClose={() => {
						setDisplay(false)
						runRestricted("closeaoc")
					}}
				/>
			)}
		</>
	)
}
