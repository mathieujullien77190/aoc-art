/** @format */

import { Suspense, useState, useEffect } from "react"

type DynamicProps = { children: JSX.Element }

const Loading = () => {
	const [seconde5, setSeconde5] = useState<boolean>(false)
	const [seconde25, setSeconde25] = useState<boolean>(false)

	useEffect(() => {
		const timer5 = window.setTimeout(() => {
			setSeconde5(true)
		}, 5000)
		const timer25 = window.setTimeout(() => {
			setSeconde25(true)
		}, 25000)

		return () => {
			clearTimeout(timer5)
			clearTimeout(timer25)
		}
	}, [])
	return (
		<div>
			<p>Chargement...</p>
			{seconde5 && <p>Peux durer 20 secondes :(</p>}
			{seconde25 && <p>Peux planter aussi :D</p>}
		</div>
	)
}

const Dynamic = ({ children }: DynamicProps) => {
	return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default Dynamic
