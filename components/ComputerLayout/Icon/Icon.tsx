import { useEffect, useState } from "react"
import { IconProps } from "./types"
import * as S from "./UI"

export const Icon = ({ name, image, open, onClick = () => {} }: IconProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(open)

	useEffect(() => {
		setIsOpen(open)
	}, [open])

	return (
		<S.Container
			onClick={() => {
				setIsOpen(prev => !prev)
				onClick(name)
			}}
			$isOpen={isOpen}
		>
			<S.Image>{image}</S.Image>
			<S.Name>{name}</S.Name>
		</S.Container>
	)
}
