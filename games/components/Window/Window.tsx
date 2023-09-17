/** @format */

import { useEffect, useState } from "react"
import TitleDay from "../TitleDay"
import { WindowProps } from "./types"
import * as S from "./UI"

let timer1

export const Window = ({ game, args, onClose }: WindowProps) => {
	const link = `https://adventofcode.com/${game.year}/day/${game.day}`
	const [hole, setHole] = useState<boolean>(false)
	const [openHole1, setOpenHole1] = useState<number>(0)

	const handleFuck = () => {
		setHole(true)

		timer1 = setInterval(() => {
			setOpenHole1(prev => prev + 1)
		}, 25)
	}

	useEffect(() => {
		if (openHole1 > 150) clearInterval(timer1)
	}, [openHole1])

	return (
		<S.Container
			className="window"
			style={
				hole
					? {
							clipPath: `polygon(
					0% 0%,
					100% 0%,
					100% 100%,
					calc(100% - 110px) calc(100% - ${openHole1}px),
					calc(100% - 220px) 100%,
					0% 100%
						)`,
					  }
					: {}
			}
		>
			<>
				<TitleDay
					year={game.year}
					day={game.day}
					title={game.title}
					special={game.special}
					AOCUrl={link}
					onClose={onClose}
					onFuck={handleFuck}
				/>

				{game.component({ args })}
			</>
		</S.Container>
	)
}
