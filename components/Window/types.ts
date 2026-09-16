import { ReactNode, RefObject } from "react"

export type Pos = { x: number; y: number }
export type Mode = "medium" | "full" | "close"

export type WindowProps = {
	show: boolean
	container: RefObject<HTMLDivElement>
	title?: string
	/** marque du cadre entier, pour poser un calque par-dessus */
	mark?: string
	/**
	 * Rang d'agrandissement : chaque increment ouvre la fenetre en grand.
	 * Un booleen ne servirait qu'une fois — le visiteur peut la reduire
	 * ensuite, et la demande suivante doit quand meme la rouvrir pleine.
	 */
	expand?: number
	/** etage d'empilement : la fenetre au premier plan a le plus grand */
	layer?: number
	/** rang dans la cascade, pour ne pas s'ouvrir sur la precedente */
	rank?: number
	/**
	 * Hauteur reservee en bas du conteneur, en CSS. Le bureau y met sa
	 * barre des taches ; sans elle, la fenetre passerait dessous.
	 */
	bottomInset?: string
	/**
	 * Pleine et non redimensionnable. A qui l'affiche de decider quand :
	 * un petit ecran, un mode lecture, une preference. Le paquet ne fixe
	 * aucun seuil.
	 */
	compact?: boolean
	/**
	 * Gabarit portrait fixe plutot que le carre moyen habituel, pour un
	 * contenu pense pour un ecran de telephone. Non redimensionnable, comme
	 * `compact` — les deux se melangent mal, `compact` gagne sur petit ecran.
	 */
	phone?: boolean
	/**
	 * Le contenu porte son propre cadre : la fenetre lui laisse toute la
	 * place entre ses bordures, sans marge ni fond a elle. C'est le cas du
	 * shell, dont le theme pose sa marge et sa couleur de fond — depuis
	 * que les themes ont lache leur bordure, une bande de la fenetre
	 * autour de lui ne serait plus qu'un lisere d'une autre couleur.
	 */
	flush?: boolean
	/** la fenetre reclame le premier plan */
	onFocus?: () => void
	children: ReactNode
	onClose?: () => void
}
