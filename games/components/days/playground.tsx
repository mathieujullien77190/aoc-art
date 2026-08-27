import React, { useState } from "react"
import styled from "styled-components"

import Function from "_games/components/Function"

import { init, Story } from "_games/core/playground"

const Container = styled.div`
	height: calc(100% - 40px);
	display: flex;
	flex-direction: column;
	padding: 20px 12px;
	overflow-y: auto;
`

const Animation = () => {
	// init() est pur : on le joue a l'initialisation plutot que dans un effet
	const [stories] = useState<Story[]>(() => init())

	return (
		<Container>
			{stories.map(story => (
				<Function key={story.id} story={story} />
			))}
		</Container>
	)
}

export default Animation
