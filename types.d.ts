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
	redux?: ({ args }: { args?: Command["args"] }) => unknown
	JSX?: ({ args }: { args?: Command["args"] }) => import("react").JSX.Element
	help?: Help
	testArgs?: Args
	display?: {
		hideCmd?: boolean
		style?: CSSProperties
		stylePre?: CSSProperties
		highlight?: (txt: string) => import("react").JSX.Element[]
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
