import React from "react"
import type { Metadata } from "next"

import StyledRegistry from "_components/StyledRegistry"

import { app } from "_components/constants"

export const metadata: Metadata = {
	title: app.name,
	description: `${app.name} : Par ${app.author}`,
	icons: { shortcut: "/favicon.ico" },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
	<html lang="fr">
		<body>
			<StyledRegistry>{children}</StyledRegistry>
		</body>
	</html>
)

export default RootLayout
