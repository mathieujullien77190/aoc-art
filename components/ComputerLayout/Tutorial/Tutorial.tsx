import { useEffect, useState } from "react"

import { useAppDispatch } from "_store/hooks"
import { setProperties, useGetLanguage, useGetTutorial } from "_store/global/"
import { useGetLastCommand } from "_store/history/"

import { pick } from "_commands/lang"

import { NEXT, PADDING, QUIT, STEPS } from "./constants"
import { format, hasSeen, markSeen, placeBox } from "./helpers"
import { useTargetRect } from "./hooks"

import * as S from "./UI"

/**
 * Visite guidee : un projecteur sur l'element porteur de la marque
 * data-tutorial de l'etape, et une bulle qui explique.
 *
 * L'etat vit dans le store, pas ici : l'icone du bureau et la commande
 * tutorial la lancent, et l'icone s'allume tant qu'elle tourne.
 */
export const Tutorial = () => {
	const dispatch = useAppDispatch()

	const lang = useGetLanguage()
	const running = useGetTutorial()
	const lastCommand = useGetLastCommand()

	const [index, setIndex] = useState<number>(0)
	const [prevRunning, setPrevRunning] = useState<boolean>(running)
	const [prevCommand, setPrevCommand] = useState<string>(
		lastCommand?.id || null
	)

	// le storage n'existe pas au prerendu : la premiere venue se decide au
	// montage, et lance la visite comme le ferait l'icone
	useEffect(() => {
		if (!hasSeen()) dispatch(setProperties({ key: "tutorial", value: true }))
	}, [dispatch])

	// relancee, la visite repart de la premiere etape
	if (prevRunning !== running) {
		setPrevRunning(running)
		if (running) setIndex(0)
	}

	const step = running ? STEPS[index] : null

	// certaines etapes se terminent seules quand le visiteur joue la
	// commande demandee ; l'etape suivante existe toujours, une etape en
	// attente n'est jamais la derniere
	if (prevCommand !== (lastCommand?.id || null)) {
		setPrevCommand(lastCommand?.id || null)
		if (step?.awaitCommand && lastCommand?.name === step.awaitCommand) {
			setIndex(prev => Math.min(prev + 1, STEPS.length - 1))
		}
	}

	const rect = useTargetRect(
		step?.target || null,
		step?.fallback || null,
		running
	)

	const stop = () => {
		markSeen()
		dispatch(setProperties({ key: "tutorial", value: false }))
	}

	const next = () => {
		if (index + 1 >= STEPS.length) stop()
		else setIndex(prev => prev + 1)
	}

	if (!step) return null

	// tant que la premiere marque n'est pas posee, la machine demarre
	// encore : la visite attend son tour
	if (!rect && index === 0) return null

	const box = placeBox(rect)

	return (
		<S.Overlay>
			{rect ? (
				<S.Hole
					$top={rect.top - PADDING}
					$left={rect.left - PADDING}
					$width={rect.width + PADDING * 2}
					$height={rect.height + PADDING * 2}
				/>
			) : (
				<S.Veil />
			)}

			<S.Box
				$top={box.top}
				$left={box.left}
				$width={box.width}
				// le shell reprend le focus des qu'il le perd : sans cela un clic
				// sur un bouton ferait clignoter la saisie
				onMouseDown={event => event.preventDefault()}
			>
				<S.Title>{pick(step.title, lang)}</S.Title>
				<S.Text>{format(pick(step.text, lang))}</S.Text>

				<S.Footer>
					<S.Counter>
						{index + 1}/{STEPS.length}
					</S.Counter>
					<S.Actions>
						<S.Ghost onClick={stop}>{pick(QUIT, lang)}</S.Ghost>
						<S.Button onClick={next}>{pick(NEXT, lang)}</S.Button>
					</S.Actions>
				</S.Footer>
			</S.Box>
		</S.Overlay>
	)
}
