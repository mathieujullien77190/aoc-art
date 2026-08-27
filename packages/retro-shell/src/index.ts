export { Shell } from "./Shell"
export type { ShellProps } from "./Shell"

export { baseCommands } from "./commands/base"
export { highlightFlower, plantFlowers } from "./commands/flowers"

export { run, runRestricted } from "./engine/send"
export {
	autocompleteCommand,
	createCommand,
	executeCommand,
	findCommand,
} from "./engine/terminalEngine"

export { BASE_LANG, browserLang, FLOWER_LANG, LANGS, pick } from "./i18n/lang"

export { highlight, trad } from "./render/Command/helpers"

export {
	shellActions,
	useAnimation,
	useGetCommands,
	useGetCurrentCommand,
	useGetCursor,
	useGetLastCommand,
	useGetStart,
	useKeyboardOnFocus,
	useLang,
	useShellStore,
} from "./state/store"

export { defaultTheme, setTheme, theme } from "./theme"
export type { ShellColors, ShellFlowers, ShellTheme } from "./theme"

export type {
	Action,
	Args,
	BaseCommand,
	Command,
	Help,
	Translatable,
} from "./types"
