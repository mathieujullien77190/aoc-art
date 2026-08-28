import React, { ReactNode } from "react"
import reactStringReplace from "react-string-replace"
import { Translatable } from "../../types"
import { FLOWER_LANG } from "../../i18n/lang"
import { colors, theme } from "../../theme"
import uniqid from "uniqid"

export const trad = (input: Translatable, lang: string) => {
	if (lang === FLOWER_LANG) return toFlowers(input["fr"] || input)

	return input[lang] || input
}

/**
 * Le mode fleuri : chaque caractere devient une fleur, une par famille —
 * voyelles, consonnes, chiffres. Les accents sont retires avant, sinon un
 * "é" compterait pour deux caracteres apres normalisation.
 *
 * L'ordre compte : les chiffres d'abord, les voyelles ensuite, et ce qui
 * reste de l'alphabet reçoit la fleur des consonnes.
 */
const toFlowers = (text: string): string => {
	const { flowers } = theme()

	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[0-9]/g, flowers.digit)
		.replace(/[aeiouy]/gi, flowers.vowel)
		.replace(/[a-z]/gi, flowers.consonant)
}

/**
 * Echappement : un marqueur precede de £ s'affiche tel quel au lieu de
 * colorer. Le caractere ne sert a rien d'autre dans les textes du
 * terminal, il n'y a donc pas besoin de l'echapper lui-meme.
 */
const ESCAPE = "£"

/**
 * Le marqueur echappe est range sous un caractere de la zone privee
 * Unicode le temps de la passe de couleur : sans cela il ferait paire
 * avec le marqueur suivant et colorerait tout ce qui les separe.
 */
const hidden = (index: number) => String.fromCharCode(0xe000 + index)

export const highlight = (
	text: string,
	onClick: (name: string, arg: string[]) => void
) => {
	let result: string | ReactNode[] = text

	const list: {
		separator: string
		styles: React.CSSProperties
		command?: string
	}[] = [
		{
			separator: "§",
			styles: { color: colors().importantColor },
		},
		{
			separator: "+",
			styles: { color: colors().infoColor },
		},
		{
			separator: "#",
			styles: { color: colors().importantColor, cursor: "pointer" },
			command: "actionmap",
		},
		{
			separator: "$",
			styles: {
				background: colors().appColor,
				color: "black",
				border: "solid 1px solid",
				padding: "0 5px",
				fontWeight: "bold",
			},
		},
		// { separator: "-", styles: { textDecoration: "line-through" } },
	]

	list.forEach((item, index) => {
		result = (result as string)
			.split(`${ESCAPE}${item.separator}`)
			.join(hidden(index))
	})

	list.forEach(item => {
		result = reactStringReplace(
			result,
			new RegExp(
				`\\${item.separator}([^\\${item.separator}]*)\\${item.separator}`,
				"g"
			),
			match => {
				let replace = match
				let arg = []

				if (match.indexOf("~") !== -1) {
					replace = match.split("~")[0]
					arg = match.split("~")[1].split(" ")
				}

				return (
					<span
						key={uniqid()}
						style={{
							...item.styles,
						}}
						onClick={() => {
							if (item.command) onClick(item.command, arg)
						}}
					>
						{replace}
					</span>
				)
			}
		)
	})

	// les marqueurs echappes reprennent leur place, sans couleur
	list.forEach((item, index) => {
		result = reactStringReplace(result, hidden(index), () => item.separator)
	})

	return result
}
