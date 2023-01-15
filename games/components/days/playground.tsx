/** @format */
import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { View } from "_games/helpers/types"
import { createEmptyView } from "_games/helpers/view"

import { colors } from "_components/constants"

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
	const [stories, setStories] = useState<Story[]>([])

	useEffect(() => {
		setStories(init())
	}, [])

	return (
		<Container>
			{stories.map(story => (
				<Function key={story.id} story={story} />
			))}
		</Container>
	)
}

export default Animation
