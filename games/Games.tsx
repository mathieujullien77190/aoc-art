/** @format */

import { useState } from "react"

import { sendRestrictedCommand } from "_commands/helpers"
import { useAppDispatch } from "_store/hooks"

import { gamesConfig } from "./constants"

import Window from "./components/Window"

export const Games = ({ day }: { day: string }) => {
	const dispatch = useAppDispatch()
	const [display, setDisplay] = useState<boolean>(true)

	const search = gamesConfig.filter(script => script.day === day)

	return (
		<>
			{display && search.length === 1 && (
				<Window
					game={search[0]}
					onClose={() => {
						setDisplay(false)
						sendRestrictedCommand("closeday", dispatch)
					}}
				/>
			)}
		</>
	)
}
