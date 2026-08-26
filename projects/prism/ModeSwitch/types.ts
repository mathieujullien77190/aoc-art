import { FeedMode } from "../types"

export type ModeSwitchProps = {
	value: FeedMode
	onChange?: (mode: FeedMode) => void
	disabled?: boolean
}
