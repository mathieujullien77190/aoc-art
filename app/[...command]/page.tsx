import type { Metadata } from "next"

import Home from "_components/Home"

import { ROUTES } from "_commands/routes"
import { app } from "_components/constants"
import { gamesMeta } from "_games/meta"

type Params = { command: string[] }

/** static export: only ROUTES lines have a page, the rest is a 404 */
export const dynamicParams = false

export const generateStaticParams = (): Params[] =>
	ROUTES.map(command => ({ command }))

/** /aoc/5: the day's title; elsewhere, the line itself */
const titleOf = (command: string[]): string => {
	const [name, arg] = command
	const game = name === "aoc" ? gamesMeta[Number(arg)] : undefined

	return `${game ? game.title : command.join(" ")} - ${app.name}`
}

export const generateMetadata = async ({
	params,
}: {
	params: Promise<Params>
}): Promise<Metadata> => {
	const { command } = await params

	return { title: titleOf(command) }
}

/**
 * /aoc/5 mounts the same desktop as the home page and plays `aoc 5` as soon
 * as the shell is up: the command does the rest.
 */
const Page = async ({ params }: { params: Promise<Params> }) => {
	const { command } = await params

	return <Home command={command.join(" ")} />
}

export default Page
