/** @format */

import { Translatable } from "_/types"

/** langue de repli : leet, xleet et # en derivent tous */
export const BASE_LANG = "fr"

export const LANGS = ["fr", "en", "leet", "xleet", "#"]

/** resout un texte traduisible vers une langue, avec repli sur le francais */
export const pick = (text: Translatable, lang: string): string =>
	typeof text === "string" ? text : text[lang] || text[BASE_LANG]
