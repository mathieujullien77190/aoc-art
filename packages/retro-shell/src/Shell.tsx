import { RefObject, useCallback, useEffect, useState } from "react"

import Terminal from "./render/Terminal"

import { run, runRestricted, setListener } from "./engine/send"
import { setBanner, setCommands } from "./state/registry"
import {
	shellActions,
	useAnimation,
	useGetCommands,
	useGetCurrentCommand,
	useKeyboardOnFocus,
	useLang,
} from "./state/store"
import { setTheme, ShellTheme } from "./theme"
import { BaseCommand } from "./types"

export type ShellProps = {
	/** les commandes connues : celles du paquet, plus les votres */
	commands: BaseCommand[]
	/**
	 * Commandes restreintes rejouees au demarrage et apres un clear. C'est
	 * la que se met la marque : le shell, lui, n'en connait aucune.
	 */
	banner?: string[]
	theme?: Partial<ShellTheme>
	/** langue de depart ; sans elle, le francais */
	lang?: string
	/** element a faire defiler quand la sortie s'allonge */
	scrollRef?: RefObject<HTMLElement>
	/** appele a chaque commande jouee, y compris celles du paquet */
	onCommand?: (name: string, args: string[]) => void
}

/**
 * Le terminal : la liste des commandes jouees et la ligne de saisie.
 *
 * Le registre, le theme et l'etat vivent au niveau du module — ils servent
 * aussi hors React, une fenetre qui se ferme peut jouer une commande.
 * Corollaire assume : un shell par page.
 */
export const Shell = ({
	commands,
	banner = [],
	theme,
	lang,
	scrollRef,
	onCommand,
}: ShellProps) => {
	// pose avant le premier rendu : le terminal lit le registre en se rendant
	const [ready] = useState(() => {
		setCommands(commands)
		setBanner(banner)
		setTheme(theme)
		return true
	})

	const history = useGetCommands()
	const currentCommand = useGetCurrentCommand()

	const options = {
		lang: useLang(),
		animation: useAnimation(),
		keyboardOnFocus: useKeyboardOnFocus(),
	}

	useEffect(() => {
		setCommands(commands)
	}, [commands])

	useEffect(() => {
		setBanner(banner)
	}, [banner])

	useEffect(() => {
		setListener(onCommand)
	}, [onCommand])

	// apres le montage, jamais pendant le rendu : la langue du navigateur
	// n'existe pas au prerendu, l'appliquer plus tot ferait diverger le HTML
	useEffect(() => {
		if (lang) shellActions().setLang(lang)
	}, [lang])

	/**
	 * La banniere s'ecrit au montage, mais seulement si l'ecran est vide.
	 * Le shell peut etre demonte puis remonte — une fenetre qu'on ferme et
	 * qu'on rouvre — alors que l'historique, lui, vit au niveau du module
	 * et a survecu : la rejouer afficherait le titre deux fois.
	 */
	useEffect(() => {
		if (!ready) return

		const { commands: played, restrictedCommands } = shellActions()
		const onScreen = [...played, ...restrictedCommands].some(
			command => command.visible
		)

		if (!onScreen) banner.forEach(name => runRestricted(name))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready])

	const scrollDown = useCallback(() => {
		scrollRef?.current?.scrollTo(0, 1000000)
	}, [scrollRef])

	const handleRendered = useCallback(
		(id: string) => {
			shellActions().setIsRendered(id)
			scrollDown()
		},
		[scrollDown]
	)

	const moveCursor = useCallback((direction: number) => {
		shellActions().moveCursor(direction)
	}, [])

	return (
		<Terminal
			options={options}
			commands={history}
			currentCommand={currentCommand}
			onSendCommand={run}
			onSendRestrictedCommand={runRestricted}
			onAnimateCommand={scrollDown}
			onSendPreviousCommand={() => moveCursor(-1)}
			onSendNextCommand={() => moveCursor(1)}
			onRendered={handleRendered}
		/>
	)
}
