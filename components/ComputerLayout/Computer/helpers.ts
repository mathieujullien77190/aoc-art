/** @format */

import { FREQ, CPU, ERROR } from "../BIOS"

export const getSpeed = (settings: Record<string, string>): number => {
	if (settings?.settings3 === CPU.CQ) return 10
	if (settings?.settings3 === CPU.C4) return 100
	if (settings?.settings3 === CPU.C2) return 500
	return 100
}

export const hasOldScreen = (settings: Record<string, string>): boolean => {
	if (!settings?.settings2) return false
	return settings?.settings2 === FREQ.low
}

export const hasFatalError = (settings: Record<string, string>): boolean => {
	if (!settings?.settings4) return true
	return settings?.settings4 === ERROR.yes
}
