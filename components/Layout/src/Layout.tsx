/** @format */

import React from "react"
import Head from "next/head"

import { LayoutProps } from "./types"
import { app } from "_components/constants"

import * as S from "./UI"

import { isMobile } from "react-device-detect"

export const Layout = ({ children, onClick = () => {} }: LayoutProps) => {
	return (
		<>
			<Head>
				<title>{app.name}</title>
				<meta charSet="UTF-8" />
				<meta name="description" content={`${app.name} : Par ${app.author}`} />
			</Head>
			<S.GlobalStyles isMobile={isMobile} />
			<S.App
				onClick={() => {
					onClick()
				}}
			>
				{children}
			</S.App>
		</>
	)
}
