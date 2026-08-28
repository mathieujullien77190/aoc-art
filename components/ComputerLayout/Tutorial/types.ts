import { Translatable } from "flower-shell"

export type Rect = { top: number; left: number; width: number; height: number }

export type Step = {
	/** valeur de l'attribut data-tutorial visee par le projecteur */
	target: string
	title: Translatable
	text: Translatable
	/** cible de repli, quand la premiere n'est plus a l'ecran */
	fallback?: string
	/** l'etape se termine seule des que cette commande est jouee */
	awaitCommand?: string
}

export type Box = { top: number; left: number; width: number }
