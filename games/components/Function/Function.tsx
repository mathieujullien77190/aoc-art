/** @format */
import React, { useEffect, useState } from "react"

import { FunctionProps } from "./types"
import * as S from "./UI"

export const Function = ({ story }: FunctionProps) => {
	const [over, setOver] = useState<number>(null)
	const [open, setOpen] = useState<boolean>(false)

	useEffect(() => {
		if (over !== null) {
			console.clear()
			console.log(story.results[over].exec().base)
		}
	}, [over])

	return (
		<S.Container>
			<S.Title onClick={() => setOpen(prev => !prev)}>
				{story.title} : {story.description}
			</S.Title>
			<S.Content open={open}>
				<S.Code>
					{story.results.map((item, i) => (
						<S.Line
							highlight={i === over}
							key={i}
							onMouseOver={() => setOver(i)}
							onMouseOut={() => setOver(null)}
						>
							{item.text}
						</S.Line>
					))}
				</S.Code>
				<S.Result>
					{story.results.map((item, i) => (
						<S.Pre
							highlight={i === over}
							key={i}
							onMouseOver={() => {
								setOver(i)
							}}
							onMouseOut={() => setOver(null)}
						>
							<span>{item.exec().display}</span>
						</S.Pre>
					))}
				</S.Result>
			</S.Content>
		</S.Container>
	)
}

export default Animation
