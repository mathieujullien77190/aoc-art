import { useState } from "react"
import { IconProps } from "./types"
import * as S from "./UI"

export const Icon = ({
	name,
	image,
	open,
	latch = true,
	onClick = () => {},
}: IconProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(open)
	const [prevOpen, setPrevOpen] = useState<boolean>(open)

	// the click flips the state locally, but the parent stays in charge: we
	// realign during render when it changes its mind, without an effect
	if (prevOpen !== open) {
		setPrevOpen(open)
		setIsOpen(open)
	}

	return (
		<S.Container
			onClick={() => {
				if (latch) setIsOpen(prev => !prev)
				onClick(name)
			}}
			$isOpen={latch ? isOpen : open}
		>
			<S.Image>{image}</S.Image>
			<S.Name>{name}</S.Name>
		</S.Container>
	)
}
