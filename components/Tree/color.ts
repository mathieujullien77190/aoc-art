import { Color } from "three"

/** Lightens (amount > 0) or darkens (amount < 0) a #rrggbb colour. */
export const shade = (hex: string, amount: number) =>
	new Color(hex).lerp(new Color(amount > 0 ? 0xffffff : 0x000000), Math.abs(amount))
