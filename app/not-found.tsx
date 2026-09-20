import type { Metadata } from "next"

import NotFound from "_components/NotFound"

import { app } from "_components/constants"

export const metadata: Metadata = {
	title: `404 - ${app.name}`,
}

export default NotFound
