import { pick } from "_i18n"

import { ICONS, WINDOW_NAMES } from "./constants"
import { DesktopIcon, IconKey, WindowName } from "./types"

export const iconOf = (key: IconKey): DesktopIcon =>
	ICONS.filter(icon => icon.key === key)[0]

/** l'icone porte-t-elle une fenetre : les autres ne s'empilent pas */
export const isWindowIcon = (key: IconKey): key is WindowName =>
	WINDOW_NAMES.includes(key as WindowName)

/** libelle de l'icone dans la langue courante */
export const labelOf = (key: IconKey, lang: string): string =>
	pick(iconOf(key).label, lang)
