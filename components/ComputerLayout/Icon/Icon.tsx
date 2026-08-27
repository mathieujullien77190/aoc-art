import { useState } from "react"
import { IconProps } from "./types"
import * as S from "./UI"

export const Icon = ({ name, image, open, onClick = () => {} }: IconProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(open)
	const [prevOpen, setPrevOpen] = useState<boolean>(open)

	// le clic bascule l'etat en local, mais le parent reste maitre : on se
	// realigne pendant le rendu quand il change d'avis, sans passer par un effet
	if (prevOpen !== open) {
		setPrevOpen(open)
		setIsOpen(open)
	}

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
