import React from "react"

import { LayoutProps } from "./types"

import * as S from "./UI"

import { isMobile } from "react-device-detect"

export const Layout = ({ children, onClick = () => {} }: LayoutProps) => {
	return (
		<>
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
