/** @format */

import { useState } from "react"

import { sendRestrictedCommand } from "_commands/helpers"
import { useAppDispatch } from "_store/hooks"

import { gamesConfig } from "./constants"

import Window from "./components/Window"

export const Games = ({
	day,
	year,
	args,
}: {
	day: string
	year: string
	args?: string[]
}) => {
	const dispatch = useAppDispatch()
	const [display, setDisplay] = useState<boolean>(true)

	const search = gamesConfig.filter(
		script => script.day === day && script.year === year
	)

	return (
		<>
			{display && search.length === 1 && (
				<Window
					args={args}
					game={search[0]}
					onClose={() => {
						setDisplay(false)
						sendRestrictedCommand("closeaoc", dispatch)
					}}
				/>
			)}
		</>
	)
}
