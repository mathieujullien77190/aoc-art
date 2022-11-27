/** @format */

import React from "react"

import { ErrorProps } from "next/error"
import { NextPage } from "next"



export const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
	return (
		<>Error : {statusCode}</>
	)
}

ErrorPage.getInitialProps = ({ res, err }) => {
	const statusCode = res?.statusCode
		? res.statusCode
		: err?.statusCode
		? err.statusCode
		: null
	//statuscode is defined only on server
	return { statusCode }
}

export default ErrorPage
