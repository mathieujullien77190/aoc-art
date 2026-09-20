"use client"

import React, { useState } from "react"
import { useServerInsertedHTML } from "next/navigation"
import { ServerStyleSheet, StyleSheetManager } from "styled-components"

/**
 * The App Router counterpart of the old _document: on server render,
 * collects the styled-components styles and injects them in the exported
 * HTML's <head>, or the page would show bare before hydration.
 */
export const StyledRegistry = ({ children }: { children: React.ReactNode }) => {
	const [sheet] = useState(() => new ServerStyleSheet())

	useServerInsertedHTML(() => {
		const styles = sheet.getStyleElement()
		sheet.instance.clearTag()

		return <>{styles}</>
	})

	// in the browser, styled-components handles its own styles
	if (typeof window !== "undefined") return <>{children}</>

	return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}
