import { useRef, useState } from "react"

import { DODGE_INSET } from "./constants"
import { AlertProps, Pos } from "./types"
import * as S from "./UI"

/** petite fenetre modale retro : un message, une rangee de boutons */
export const Alert = ({
	message,
	buttons,
	show,
	pos,
	onClose = () => {},
}: AlertProps) => {
	const containerRef = useRef<HTMLDivElement>(null)

	// ecart applique au bouton fuyant ; pose une fois, il ne bouge plus
	const [dodge, setDodge] = useState<Pos | null>(null)

	if (!show) return null

	/**
	 * Envoie le bouton dans le coin du bureau, en translation depuis sa
	 * place. Les distances se mesurent : la boite est centree, sa hauteur
	 * depend du texte, aucune valeur en dur ne tiendrait.
	 */
	const flee = (button: HTMLDivElement) => {
		const desktop = containerRef.current?.offsetParent?.getBoundingClientRect()
		if (!desktop) return

		const box = button.getBoundingClientRect()

		setDodge({
			x: desktop.right - DODGE_INSET - box.width - box.left,
			y: desktop.top + DODGE_INSET - box.top,
		})
	}

	return (
		<S.Container ref={containerRef} $pos={pos}>
			<S.topBar>
				<span onClick={onClose}>🗙</span>
			</S.topBar>

			<S.Message>{message}</S.Message>

			<S.Buttons>
				{buttons.map(button => {
					const fleeing = Boolean(button.dodge) && Boolean(dodge)

					return (
						<S.Button
							key={button.label}
							$fleeing={fleeing}
							style={
								fleeing
									? { transform: `translate(${dodge.x}px, ${dodge.y}px)` }
									: undefined
							}
							onMouseEnter={
								button.dodge && !dodge
									? event => flee(event.currentTarget)
									: undefined
							}
							onClick={button.onClick}
						>
							{button.label}
						</S.Button>
					)
				})}
			</S.Buttons>
		</S.Container>
	)
}
