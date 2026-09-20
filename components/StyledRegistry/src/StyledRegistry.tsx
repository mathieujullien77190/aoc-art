"use client"

import React, { useState } from "react"
import { useServerInsertedHTML } from "next/navigation"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"

/**
 * Le pendant App Router de l'ancien _document : au rendu serveur, collecte
 * les styles de styled-components et les injecte dans le <head> du HTML
 * exporte, sinon la page s'afficherait nue avant l'hydratation.
 */
export const StyledRegistry = ({ children }: { children: React.ReactNode }) => {
	const [sheet] = useState(() => new ServerStyleSheet())

	useServerInsertedHTML(() => {
		const styles = sheet.getStyleElement()
		sheet.instance.clearTag()

		return <>{styles}</>
	})

	// cote navigateur, styled-components gere ses styles lui-meme
	if (typeof window !== "undefined") return <>{children}</>

	return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}
