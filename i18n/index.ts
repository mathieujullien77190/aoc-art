import { shellState } from "_store/shell/"

/**
 * Displayable text: a plain string, or one variant per language. The site's
 * texts are written where they are used, which reads better than a key to
 * chase into a translation file.
 */
export type Translatable = string | { fr: string; en: string }

/** fallback language, the one texts are written in */
export const BASE_LANG = "fr"

/** resolves a translatable text to a language, falling back to French */
export const pick = (text: Translatable, lang: string): string =>
	typeof text === "string" ? text : text[lang] || text[BASE_LANG]

/**
 * Outside a component: a command plays in a terminal, and the language is
 * its own. Before a shell is mounted, the fallback language.
 */
export const say = (text: Translatable): string =>
	pick(text, shellState()?.lang || BASE_LANG)
