import { GameConfig } from "_games/constants"
import { Translatable } from "retro-shell"

export const displayList = (gamesConfig: GameConfig[]): string => {
	return (
		"\n" +
		gamesConfig
			.map(
				(script, index) =>
					` > (+${(" " + index).slice(-2)}+) ${
						script.year
					}-${`0${script.day}`.substr(-2)} : ${script.title} ${
						script.tag ? `[§${script.tag}§]` : ""
					}`
			)
			.join("\n")
	)
}

const textLoadScript = (gamesConfig: GameConfig): Translatable => ({
	fr: `§Année : ${gamesConfig.year} / Jour : ${gamesConfig.day}§\n\n${gamesConfig.title}`,
	en: `§Year: ${gamesConfig.year} / Day: ${gamesConfig.day}§\n\n${gamesConfig.title}`,
})

export const getScript = (
	args: string[],
	gamesConfig: GameConfig[]
): GameConfig | undefined => {
	const arg = args[0]
	if (arg && arg.match(/^[0-9]{1,2}$/gi) !== null) {
		return gamesConfig[parseInt(arg, 10)]
	} else if (arg && arg.match(/^[0-9]{4}\-[0-9]{1,2}$/gi)) {
		const [year, day] = arg.split("-")

		const search = gamesConfig.filter(
			script => script.day === day && script.year === year
		)
		if (search.length === 1) return search[0]
	} else if (arg) {
		const search = gamesConfig.filter(script =>
			script.title.toLowerCase().includes(arg.toLowerCase())
		)
		if (search.length === 1) return search[0]
	}
	return undefined
}

export const loadScript = (
	args: string[],
	gamesConfig: GameConfig[]
): Translatable => {
	const script = getScript(args, gamesConfig)
	return script
		? textLoadScript(script)
		: { fr: "Aucun script pour ce jour", en: "No script for that day" }
}
