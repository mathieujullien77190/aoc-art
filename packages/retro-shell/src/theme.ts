import { CSSProperties } from "react"

export type ShellColors = {
	background: string
	textColor: string
	/** ce qui compte dans un texte */
	importantColor: string
	/** le nom d'une commande jouee */
	cmdColor: string
	/** le nom d'une commande restreinte */
	restrictedColor: string
	infoColor: string
	appColor: string
}

/** une fleur par famille de caractere, pour la langue fleurie */
export type ShellFlowers = {
	vowel: string
	consonant: string
	digit: string
}

export type ShellTheme = {
	colors: ShellColors
	/** l'invite, posee devant la saisie et devant chaque commande */
	prompt: string
	flowers: ShellFlowers
}

export const defaultTheme: ShellTheme = {
	colors: {
		background: "#212E35",
		textColor: "#CED4DF",
		importantColor: "#FFCC6A",
		cmdColor: "#c4e98d",
		restrictedColor: "#d15f5f",
		infoColor: "#77CDF1",
		appColor: "#90be20",
	},
	prompt: ">",
	flowers: {
		vowel: "🌸",
		consonant: "🌼",
		digit: "🌻",
	},
}

/**
 * Le theme vit au niveau du module, comme le registre des commandes : le
 * balisage est rendu par une fonction, pas par un composant, un
 * ThemeProvider ne l'atteindrait pas. Corollaire assume : un shell par page.
 */
let current: ShellTheme = defaultTheme

export const setTheme = (theme?: Partial<ShellTheme>) => {
	if (!theme) return

	current = {
		colors: { ...current.colors, ...theme.colors },
		prompt: theme.prompt || current.prompt,
		flowers: { ...current.flowers, ...theme.flowers },
	}
}

export const theme = () => current

/** raccourci de lecture, le plus frequent dans les styles */
export const colors = (): ShellColors => current.colors

export type { CSSProperties }
