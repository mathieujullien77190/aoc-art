import { pick } from "_i18n"

import { ICONS, WINDOW_NAMES } from "./constants"
import { DesktopIcon, IconKey, WindowName } from "./types"

export const iconOf = (key: IconKey): DesktopIcon =>
	ICONS.filter(icon => icon.key === key)[0]

/** does the icon carry a window: the others do not stack */
export const isWindowIcon = (key: IconKey): key is WindowName =>
	WINDOW_NAMES.includes(key as WindowName)

/** icon label in the current language */
export const labelOf = (key: IconKey, lang: string): string =>
	pick(iconOf(key).label, lang)
