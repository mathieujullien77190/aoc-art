/** colour from the library, built by Flw.Color.createWithHex */
export type FlwColor = { toString: () => string }

export type FlwOptions = Record<string, number | string | FlwColor>

/** the plant being grown; setting _running to false stops it */
export type FlwPlant = { _running: boolean }

export type FlwGlobal = {
	Color: { createWithHex: (hex: string) => FlwColor }
	LimitedFlower: {
		create: (element: HTMLElement, option: FlwOptions, run: boolean) => FlwPlant
	}
}

export type Size = { width: number; height: number }

/** corner the plant starts from */
export type Side = "left" | "right"

declare global {
	interface Window {
		Flw?: FlwGlobal
	}
}
