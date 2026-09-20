"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"

import * as S from "./UI"

/**
 * The 404 as a blue screen, like the virus one: any key or a click goes
 * back to the desktop.
 */
export const NotFound = () => {
	const router = useRouter()

	useEffect(() => {
		const goHome = () => router.push("/")

		window.addEventListener("keyup", goHome)
		return () => window.removeEventListener("keyup", goHome)
	}, [router])

	return (
		<S.Screen onClick={() => router.push("/")}>
			<h3>System</h3>
			<p>
				A fatal exception 404 occured at 0028:C0011E36; The requested page
				could not be found.
			</p>
			<p>
				Press any key to return to the desktop <S.Cursor>_</S.Cursor>
			</p>
		</S.Screen>
	)
}
