import { Translatable } from "../types"

/** langue de repli : le mode fleuri en derive */
export const BASE_LANG = "fr"

/** le mode fleuri : les textes du francais, rendus en fleurs */
export const FLOWER_LANG = "#"

export const LANGS = ["fr", "en", FLOWER_LANG]

/**
 * Langue de depart, deduite du navigateur : tout ce qui n'est pas
 * francais demarre en anglais.
 *
 * Seule la premiere entree de navigator.languages compte, celle que le
 * visiteur a mise en tete. A appeler depuis un effet : navigator
 * n'existe pas au moment de l'export statique.
 */
export const browserLang = (): string => {
	if (typeof navigator === "undefined") return BASE_LANG

	const preferred = navigator.languages?.[0] || navigator.language || ""

	return preferred.toLowerCase().startsWith(BASE_LANG) ? BASE_LANG : "en"
}

/** resout un texte traduisible vers une langue, avec repli sur le francais */
export const pick = (text: Translatable, lang: string): string =>
	typeof text === "string" ? text : text[lang] || text[BASE_LANG]
