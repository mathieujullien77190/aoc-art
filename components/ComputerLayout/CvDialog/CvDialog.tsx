import { useState } from "react"

import { pick, useLang } from "flower-shell"

import Alert from "../Alert"
import { TEXTS } from "./constants"
import { CvDialogProps } from "./types"

/**
 * Deux temps : le choix du format, puis la confirmation du PDF. Repondre
 * non a la confirmation renvoie vers l'ASCII, format de la maison.
 *
 * Le composant n'est monte que pendant qu'il s'affiche : l'etape repart
 * donc de zero a chaque ouverture, sans remise a zero a la main.
 */
export const CvDialog = ({ onAscii, onPdf, onClose }: CvDialogProps) => {
	const lang = useLang()
	const [confirming, setConfirming] = useState<boolean>(false)

	const say = (key: string) => pick(TEXTS[key], lang)

	if (confirming)
		return (
			<Alert
				show
				message={say("confirm")}
				buttons={[
					{ label: say("yes"), onClick: onPdf },
					{ label: say("no"), onClick: onAscii },
				]}
				onClose={onClose}
			/>
		)

	return (
		<Alert
			show
			message={say("intro")}
			buttons={[
				{ label: say("ascii"), onClick: onAscii },
				{
					label: say("pdf"),
					onClick: () => setConfirming(true),
					// il se derobe au premier survol, puis se laisse attraper
					dodge: true,
				},
			]}
			onClose={onClose}
		/>
	)
}
