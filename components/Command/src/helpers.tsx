/** @format */
import reactStringReplace from "react-string-replace"
import { colors, app } from "_components/constants"
import uniqid from "uniqid"
import React from "react"

export const trad = (input: string, lang: string) => {
	if (lang === "leet") return frToLeet(input["fr"] || input)
	if (lang === "xleet") return frToLeet(input["fr"] || input, true)
	if (lang === "#")
		return (input["fr"] || input)
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[\wç]/gi, app.logo)
	return input[lang] || input
}

const frToLeet = (txt: string, advanced: boolean = false): string => {
	const alphabetBasic = {
		a: "4",
		b: "8",
		e: "3",
		f: "ph",
		g: "6", // or 9
		i: "1", // or |
		o: "0",
		s: "5",
		t: "7", // or +
	}

	const alphabetAdvanced = {
		c: "(", // or k or |< or /<
		d: "<|",
		h: "|-|",
		k: "|<", // or /<
		l: "|", // or 1
		m: "|\\/|",
		n: "|\\|",
		p: "|2",
		u: "|_|",
		v: "/", // or \/
		w: "//", // or \/\/
		x: "><",
		y: "'/",
	}

	// Convert input into l33t
	const convertInput = (text, useAdvanced = "n") => {
		for (let i = 0; i < text.length; i++) {
			let alphabet
			let letter = text[i].toLowerCase()

			if (useAdvanced.toLowerCase() === "y") {
				// Use advanced l33t speak alphabet
				alphabet = alphabetBasic[letter]
					? alphabetBasic[letter]
					: alphabetAdvanced[letter]
			} else {
				// Use basic l33t speak alphabet
				alphabet = alphabetBasic[letter]
			}

			if (alphabet) {
				text = text.replace(text[i], alphabet)
			}
		}

		return text
	}

	return convertInput(txt, advanced ? "y" : "n")
}

export const highlight = (
	text: string,
	onClick: (name: string, arg: string[]) => void,
	lang: string
) => {
	let result: string | React.ReactNodeArray = text

	const list: {
		separator: string
		styles: React.CSSProperties
		command?: string
	}[] = [
		{
			separator: "§",
			styles: { color: colors.importantColor },
		},
		{
			separator: "+",
			styles: { color: colors.infoColor },
		},
		{
			separator: "#",
			styles: { color: colors.importantColor, cursor: "pointer" },
			command: "actionmap",
		},
		{
			separator: "$",
			styles: {
				background: colors.appColor,
				color: "black",
				border: "solid 1px solid",
				padding: "0 5px",
				fontWeight: "bold",
			},
		},
		// { separator: "-", styles: { textDecoration: "line-through" } },
	].filter(
		item => (item.separator !== "-" && lang === "xleet") || lang !== "xleet"
	)

	list.forEach(item => {
		result = reactStringReplace(
			result,
			new RegExp(
				`\\${item.separator}([^\\${item.separator}]*)\\${item.separator}`,
				"g"
			),
			(match, i) => {
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

	return result
}
