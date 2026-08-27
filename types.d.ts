import { CSSProperties } from "react"

/**
 * Texte affichable : une chaine simple, ou une variante par langue.
 * `leet`, `xleet` et `#` derivent de `fr`, ils n'ont pas d'entree propre.
 */
export type Translatable = string | { fr: string; en: string }

export type Help = {
	description?: Translatable
	patterns: { pattern: string; description: Translatable }[]
}

export type Action = ({
	name,
	args,
	help,
	commands,
}: {
	name?: Command["name"]
	args?: Command["args"]
	help?: Command["help"]
	commands?: BaseCommand[]
}) => Translatable

export type Args = { authorize: string[]; empty: boolean }

export type BaseCommand = {
	restricted: boolean
	name: string
	action: Action
	/** effet de bord de la commande : elle attaque le store elle-meme */
	effect?: ({ args }: { args?: Command["args"] }) => void
	JSX?: ({ args }: { args?: Command["args"] }) => import("react").JSX.Element
	help?: Help
	testArgs?: Args
	display?: {
		hideCmd?: boolean
		style?: CSSProperties
		stylePre?: CSSProperties
		/** rendu colore du resultat ; une chaine intacte est un rendu valide */
		highlight?: (txt: string) => import("react").ReactNode
		trad?: boolean
		reverse?: boolean
		stepTime?: number
		stepSize?: number
		animation?: boolean
	}
}

export type Command = {
	pattern: string
	name: string
	args: string[]
	result: Translatable
	restricted: boolean
	visible?: boolean
	timestamp?: number
	id: string
	canExecute: boolean
	isRendered: boolean
}
