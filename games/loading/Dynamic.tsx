/** @format */

import { Suspense } from "react"
import styled from "styled-components"

type DynamicProps = { children: JSX.Element }

const Container = styled.div`
	padding: 48px 24px;
`

const Loading = () => {
	return <Container>Chargement...</Container>
}

const Dynamic = ({ children }: DynamicProps) => {
	return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default Dynamic
