/** @format */

import TitleDay from "../TitleDay"
import { WindowProps } from "./types"
import * as S from "./UI"

export const Window = ({ game, onClose }: WindowProps) => {
	const link = `https://adventofcode.com/${game.year}/day/${game.day}`

	return (
		<S.Container className="window">
			<>
				<TitleDay
					year={game.year}
					day={game.day}
					title={game.title}
					special={game.special}
					AOCUrl={link}
					onClose={onClose}
				/>

				{game.component()}
			</>
		</S.Container>
	)
}
