import { pick } from "_commands/lang"

import { ICONS } from "./constants"
import { DesktopIcon, IconKey } from "./types"

export const iconOf = (key: IconKey): DesktopIcon =>
	ICONS.filter(icon => icon.key === key)[0]

/** libelle de l'icone dans la langue courante */
export const labelOf = (key: IconKey, lang: string): string =>
	pick(iconOf(key).label, lang)
