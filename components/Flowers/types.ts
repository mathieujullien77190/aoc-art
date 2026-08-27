/** couleur de la bibliotheque, construite par Flw.Color.createWithHex */
export type FlwColor = { toString: () => string }

export type FlwOptions = Record<string, number | string | FlwColor>

/** la plante en cours de pousse ; passer _running a false l'arrete */
export type FlwPlant = { _running: boolean }

export type FlwGlobal = {
	Color: { createWithHex: (hex: string) => FlwColor }
	LimitedFlower: {
		create: (element: HTMLElement, option: FlwOptions, run: boolean) => FlwPlant
	}
}

export type Size = { width: number; height: number }

/** coin d'ou part la plante */
export type Side = "left" | "right"

declare global {
	interface Window {
		Flw?: FlwGlobal
	}
}
