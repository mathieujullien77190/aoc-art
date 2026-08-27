import { RootState } from "../root"
import { useAppSelector } from "_store/hooks"

export const useGetLanguage = () =>
	useAppSelector((state: RootState) => state.global.lang)

export const useGetAnimation = () =>
	useAppSelector((state: RootState) => state.global.animation)

export const useGetKeyboardOnFocus = () =>
	useAppSelector((state: RootState) => state.global.keyboardOnFocus)

export const useGetTutorial = () =>
	useAppSelector((state: RootState) => state.global.tutorial)

export const useGetFlowers = () =>
	useAppSelector((state: RootState) => state.global.flowers)

export const useGetVirus = () =>
	useAppSelector((state: RootState) => state.global.virus)

export const useGetWindows = () =>
	useAppSelector((state: RootState) => state.global.windows)
