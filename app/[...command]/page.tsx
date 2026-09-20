import type { Metadata } from "next"

import Home from "_components/Home"

import { ROUTES } from "_commands/routes"
import { app } from "_components/constants"
import { gamesMeta } from "_games/meta"

type Params = { command: string[] }

/** export statique : seules les lignes de ROUTES ont une page, le reste tombe en 404 */
export const dynamicParams = false

export const generateStaticParams = (): Params[] =>
	ROUTES.map(command => ({ command }))

/** /aoc/5 : le titre du jour ; ailleurs, la ligne elle-meme */
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
 * /aoc/5 monte le meme bureau que l'accueil, et joue +aoc 5+ des que le
 * shell est la : la commande fait le reste (fenetre, animation).
 */
const Page = async ({ params }: { params: Promise<Params> }) => {
	const { command } = await params

	return <Home command={command.join(" ")} />
}

export default Page
