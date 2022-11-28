/** @format */

import { Suspense, lazy } from "react"

const Dynamic = lazy(() => import("./dynamic2021"))

const Loading = () => {
	return <div>LOADING...</div>
}

const Game2021 = () => {
	return (
		<Suspense fallback={<Loading />}>
			<Dynamic time={20} />
		</Suspense>
	)
}

export default Game2021
