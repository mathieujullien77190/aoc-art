import { useState, useEffect, Ref, forwardRef } from "react"
import { ComputerProps } from "./types"
import * as S from "./UI"
import { getSpeed, hasOldScreen, hasFatalError } from "./helpers"
import { useIsMounted } from "./hooks"

import Windows from "../Windows"
import Loading from "../Loading"
import BIOS from "../BIOS"

import { rand } from "../helpers/math"
import { createArray } from "../helpers/array"
import { getStorage } from "../helpers/localStorage"

const code = () => {
	const part1 = createArray(4)
		.map(() => rand(0, 9))
		.join("")
	const part2 = createArray(8)
		.map(() => rand(0, 19).toString(16))
		.join("")
	return `${part1}:${part2}`.toUpperCase()
}

const BaseComputer = (
	{ children, onCloseWindow = () => {}, onRunCommand }: ComputerProps,
	ref: Ref<HTMLDivElement>
) => {
	const [power, setPower] = useState<boolean>(true)
	const [ready, setReady] = useState<boolean>(false)
	const [bios, setBios] = useState<boolean>(false)
	const [wantToGoBIOS, setWantToGoBIOS] = useState<boolean>(false)

	const [fatalError, setFatalError] = useState<boolean>(false)

	const build = useIsMounted()

	// le storage n'existe pas au prerendu : lecture paresseuse au premier
	// rendu client, puis relecture a la sortie du BIOS, qui vient d'ecrire
	const [settings, setSettings] = useState<Record<string, string>>(() =>
		typeof window === "undefined" ? {} : getStorage("settings") || {}
	)

	const gotoBios = (event: KeyboardEvent) => {
		if (event.code === "Delete" && !wantToGoBIOS) setWantToGoBIOS(true)
	}

	useEffect(() => {
		window.addEventListener("keyup", gotoBios)
		return () => {
			window.removeEventListener("keyup", gotoBios)
		}
	}, [])

	return (
		<S.Wrapper>
			{build && (
				<S.Computer>
					<S.Desktop
						$power={power}
						$fatalError={fatalError}
						$ready={ready}
						$bios={bios}
						$oldScreen={hasOldScreen(settings)}
					>
						{!fatalError && (
							<>
								{power && !ready && !bios && (
									<Loading
										speed={getSpeed(settings)}
										onFinish={() => {
											if (wantToGoBIOS) setBios(true)
											else setReady(true)
										}}
									/>
								)}
								{power && ready && (
									<Windows
										ref={ref}
										onBlueScreen={force => {
											if (force || hasFatalError(settings)) setFatalError(true)
										}}
										onCloseWindow={onCloseWindow}
										onRunCommand={onRunCommand}
									>
										{children}
									</Windows>
								)}
								{power && bios && (
									<BIOS
										onExit={() => {
											setWantToGoBIOS(false)
											setBios(false)
											setReady(false)
											setPower(false)
											setSettings(getStorage("settings") || {})
											window.setTimeout(() => setPower(true), 500)
										}}
									/>
								)}
							</>
						)}
						{fatalError && power && (
							<S.FatalError>
								<h3>System</h3>
								<p>
									A fatal exception 0A occured at {code()}; Operating system has
									been stopped to prevent damage to your computer.
								</p>
								<p>Refresh your broswer to reboot.</p>
							</S.FatalError>
						)}
					</S.Desktop>
				</S.Computer>
			)}
		</S.Wrapper>
	)
}

export const Computer = forwardRef<HTMLDivElement, ComputerProps>(BaseComputer)
