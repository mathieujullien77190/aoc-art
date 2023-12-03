import { GameConfig, gamesConfig } from "_games/constants"

export const displayList = (gamesConfig: GameConfig[]): string => {
	return (
		"\n" +
		gamesConfig
			//.filter(script => !script.special)
			.map(
				(script, index) =>
					` > (+${index}+) ${script.year}-${`0${script.day}`.substr(-2)} : ${
						script.title
					}`
			)
			.join("\n")
	)
}

const textLoadScript = (gamesConfig: GameConfig) => {
	return `§Année : ${gamesConfig.year} / Jour : ${gamesConfig.day}§\n\n${gamesConfig.title}`
}

export const getScript = (
	args: string[],
	gamesConfig: GameConfig[]
): GameConfig | undefined => {
	const arg = args[0]
	if (arg && arg.match(/^[0-9]{1,2}$/gi) !== null) {
		return gamesConfig[parseInt(arg, 10)]
	} else if (arg && arg.match(/^[0-9]{4}\-[0-9]{1,2}$/gi)) {
		debugger
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
): string => {
	const script = getScript(args, gamesConfig)
	return script ? textLoadScript(script) : `Aucun script pour ce jour`
}
