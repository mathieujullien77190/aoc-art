import { useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Shell } from "./Shell"
import { baseCommands } from "./commands/base"
import { shellActions } from "./state/store"
import { BaseCommand } from "./types"

/**
 * L'etat du shell vit dans un module : sans ca, l'historique d'une story
 * suivrait dans la suivante. Le vidage se fait pendant le rendu du
 * decorateur, donc avant que le shell ne monte et ne joue sa banniere.
 */
const Fresh = ({ children }: { children: React.ReactNode }) => {
	useState(() => {
		shellActions().reset()
		return true
	})

	return children
}

/**
 * La boite qui accueille le shell : plus petite que la page, bordee, et
 * surtout defilante. Sa ref part en scrollRef, ce qui permet au shell de
 * la faire descendre quand la sortie s'allonge — sans elle, tout ce qui
 * depasse resterait hors d'atteinte.
 */
const Boxed = ({
	children,
}: {
	children: (box: React.RefObject<HTMLDivElement>) => React.ReactNode
}) => {
	const box = useRef<HTMLDivElement>(null)

	return (
		<Fresh>
			<div style={{ height: "100vh", boxSizing: "border-box", padding: 32 }}>
				<div
					ref={box}
					style={{
						height: "100%",
						overflowY: "auto",
						border: "solid 2px #000000",
						borderRadius: 4,
						boxShadow: "3px 2px 4px #00000041",
					}}
				>
					{children(box)}
				</div>
			</div>
		</Fresh>
	)
}

/** Le terminal seul, remis a neuf a chaque story par le decorateur Fresh. */
const meta: Meta<typeof Shell> = {
	title: "Shell",
	component: Shell,
	decorators: [
		(Story, context) => (
			<Boxed>
				{box => <Story args={{ ...context.args, scrollRef: box }} />}
			</Boxed>
		),
	],
}

export default meta

type Story = StoryObj<typeof Shell>

/** les commandes livrees avec le paquet, rien de plus */
export const Default: Story = {
	args: {
		commands: baseCommands,
	},
}

/**
 * Une liste vide tient debout : le moteur cherche ses commandes d'erreur
 * par leur nom, et se rabat sur un message interne quand elles manquent.
 * Rien ne repond, mais rien ne casse.
 */
export const NoCommands: Story = {
	args: {
		commands: [],
	},
}

/** l'ouverture : le logo du paquet, puis le mot d'accueil du consommateur */
export const WithOpening: Story = {
	args: {
		commands: baseCommands,
		showTitle: true,
		welcome: {
			fr: "Tapez `help` pour voir les commandes",
			en: "Type `help` to list the commands",
		},
	},
}

const ping: BaseCommand = {
	restricted: false,
	name: "ping",
	action: ({ args }) => `pong ${args.join(" ")}`.trim(),
	help: {
		patterns: [
			{
				pattern: "ping [texte]",
				description: { fr: "repond pong", en: "answers pong" },
			},
		],
	},
}

const dice: BaseCommand = {
	restricted: false,
	name: "dice",
	action: () => {
		const value = Math.floor(Math.random() * 6) + 1
		return { fr: `§${value}§ !`, en: `§${value}§ !` }
	},
	help: {
		patterns: [
			{
				pattern: "dice",
				description: { fr: "lance un de", en: "rolls a die" },
			},
		],
	},
}

/** une commande maison s'ajoute a la liste, le reste ne bouge pas */
export const CustomCommands: Story = {
	args: {
		commands: [...baseCommands, ping, dice],
	},
}

/** couleurs, invite et fleurs : tout se remplace, le reste garde ses defauts */
export const CustomTheme: Story = {
	args: {
		commands: baseCommands,
		theme: {
			colors: {
				background: "#1b1b2f",
				textColor: "#e6e6e6",
				importantColor: "#e94560",
				cmdColor: "#53d8fb",
				restrictedColor: "#f0a500",
				infoColor: "#9d8df1",
				appColor: "#53d8fb",
			},
			prompt: "λ",
			flowers: { vowel: "🍁", consonant: "🌿", digit: "🍄" },
		},
	},
}

/**
 * Le meme shell, pose dans son cadre : barre de titre a glisser, bouton
 * d'agrandissement, croix. Le conteneur borne le deplacement.
 */
const Framed = () => {
	const container = useRef<HTMLDivElement>(null)

	return (
		<div
			ref={container}
			style={{ position: "relative", height: "100%", background: "#84787A" }}
		>
			<Shell
				commands={baseCommands}
				showTitle
				window={{ show: true, title: "flower-shell", container }}
			/>
		</div>
	)
}

export const InWindow: Story = {
	parameters: { layout: "fullscreen" },
	decorators: [
		Story => (
			<Fresh>
				<Story />
			</Fresh>
		),
	],
	render: () => <Framed />,
}

/** le shell en anglais des le depart */
export const English: Story = {
	args: {
		commands: baseCommands,
		lang: "en",
	},
}
