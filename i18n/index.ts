import { shellState } from "_store/shell/"

/**
 * Texte affichable : une chaine simple, ou une variante par langue.
 *
 * Le paquet flower-shell ne connait plus ce format — ses textes a lui
 * passent par un dictionnaire de cles et t(). Ceux du site restent ecrits
 * a l'endroit ou ils servent, c'est plus lisible qu'une cle a suivre
 * jusqu'a un fichier de traduction.
 */
export type Translatable = string | { fr: string; en: string }

/** langue de repli, celle dans laquelle les textes sont ecrits */
export const BASE_LANG = "fr"

/** resout un texte traduisible vers une langue, avec repli sur le francais */
export const pick = (text: Translatable, lang: string): string =>
	typeof text === "string" ? text : text[lang] || text[BASE_LANG]

/**
 * Hors composant : une commande joue dans un terminal, et la langue est
 * la sienne. Avant qu'un shell soit monte, la langue de repli.
 */
export const say = (text: Translatable): string =>
	pick(text, shellState()?.lang || BASE_LANG)
