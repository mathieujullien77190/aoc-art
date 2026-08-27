import React, {
	useCallback,
	useState,
	KeyboardEvent,
	useRef,
	useEffect,
} from "react"
import { InputProps } from "./types"
import { isMobile } from "react-device-detect"

import { app } from "_components/constants"

import { commands as baseCommands } from "_commands/commands"
import { autocompleteCommand } from "_commands/terminalEngine"

import * as S from "./UI"
import { cleanCommand } from "./helpers"

export const Input = ({
	value = "",
	forceFocus,
	options,
	onValidate = () => {},
	onCallPrevious = () => {},
	onCallNext = () => {},
}: InputProps) => {
	const [inputValue, setInputValue] = useState<string>(value)
	const [predict, setPredict] = useState<string>("")
	const [nbsLetters, setNbsLetters] = useState<number>(0)
	const [prevValue, setPrevValue] = useState<string>(value)
	const ref = useRef<HTMLInputElement>(null)

	// la saisie est locale, mais l'historique impose sa valeur : on se realigne
	// pendant le rendu quand le parent en pousse une nouvelle
	if (prevValue !== value) {
		setPrevValue(value)
		setInputValue(value)
		setNbsLetters(value.length)
	}

	const handleKeyUp = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			const commandPattern = cleanCommand(e.currentTarget.value)
			const autocomplete = autocompleteCommand({
				commands: baseCommands,
				startCommand: commandPattern,
			})

			setNbsLetters(e.currentTarget.value.length)
			setPredict(autocomplete)

			if (commandPattern === "") {
				e.preventDefault()
			} else if (e.key === "Enter" && autocomplete !== "" && isMobile) {
				setInputValue(autocomplete + " ")
				setNbsLetters(autocomplete.length + 1)
				setPredict("")
			} else if (e.key === "Enter") {
				onValidate(commandPattern)
				setInputValue("")
				setNbsLetters(0)
				setPredict("")
			} else if (e.key === "Tab" && autocomplete !== "") {
				setInputValue(autocomplete + " ")
				setNbsLetters(autocomplete.length + 1)
				setPredict("")
			}
		},
		[onValidate]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "ArrowUp") {
				onCallPrevious()
				e.preventDefault()
			} else if (e.key === "ArrowDown") {
				onCallNext()
				e.preventDefault()
			} else if (e.key === "Tab") {
				e.preventDefault()
			}
		},
		[onCallPrevious, onCallNext]
	)

	useEffect(() => {
		ref?.current?.focus()
	}, [options.keyboardOnFocus])

	useEffect(() => {
		if (options.keyboardOnFocus) ref?.current?.focus()
	}, [forceFocus])

	const predictDisplay = `( ${predict}? appuyez sur [${
		isMobile ? "ENTER" : "TAB"
	}] )`

	return (
		<S.Container>
			<S.Lambda>{app.logo}</S.Lambda>
			<S.CustomInput
				$nbsLetters={nbsLetters}
				ref={ref}
				value={inputValue}
				spellCheck="false"
				autoComplete="false"
				autoCapitalize="off"
				autoCorrect="off"
				onBlur={() => {
					if (options.keyboardOnFocus) ref?.current?.focus()
				}}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				onChange={e => {
					setInputValue(e.currentTarget.value)
				}}
			/>
			{predict !== "" && <S.Predict>{predictDisplay}</S.Predict>}
		</S.Container>
	)
}
