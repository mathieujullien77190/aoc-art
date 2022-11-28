/** @format */
import { CSSProperties } from "react"

export type Help = {
	description?: string
	patterns: { pattern: string; description: string }[]
}

export type Action = ({
	name,
	args,
	help,
	commands,
}: {
	name?: Command["name"]
	args?: Command["args"]
	help?: Command["help"]
	commands?: BaseCommand[]
}) => string

export type Args = { authorize: string[]; empty: boolean }

export type BaseCommand = {
	restricted: boolean
	name: string
	action: Action
	redux?: ({ args }: { args?: Command["args"] }) => unknown
	JSX?: ({ args }: { args?: Command["args"] }) => JSX.Element
	help?: Help
	testArgs?: Args
	display?: {
		hideCmd?: boolean
		style?: CSSProperties
		stylePre?: CSSProperties
		highlight?: (txt: string) => JSX.Element[]
		trad?: boolean
		reverse?: boolean
		stepTime?: number
		stepSize?: number
		animation?: boolean
	}
}

export type Command = {
	pattern: string
	name: string
	args: string[]
	result: string
	restricted: boolean
	visible?: boolean
	timestamp?: number
	id: string
	canExecute: boolean
	isRendered: boolean
}
