/** @format */

import { useEffect, useState } from "react"

export const useGetBottom = (ref: React.MutableRefObject<HTMLDivElement>) => {
	const [bottom, setBottom] = useState<number>(0)

	useEffect(() => {
		if (ref.current) {
			setBottom(-ref.current.getBoundingClientRect().height + 36)
		}
	}, [])

	return bottom
}
