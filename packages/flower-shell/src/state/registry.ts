import { BaseCommand, Translatable } from "../types"

/**
 * Les commandes connues du shell. Elles vivent au niveau du module parce
 * que tout le monde en a besoin sans etre un composant : l'autocompletion,
 * le rendu d'une ligne, et surtout `run`, appele depuis l'exterieur — une
 * fenetre du bureau, un jeu qui se ferme. Un contexte React ne couvrirait
 * pas ce dernier cas.
 *
 * Corollaire assume : un shell par page.
 */
let registry: BaseCommand[] = []

export const setCommands = (commands: BaseCommand[]) => {
	registry = commands
}

export const getCommands = (): BaseCommand[] => registry

/** les commandes restreintes rejouees au demarrage et apres un clear */
let banner: string[] = []

export const setBanner = (commands: string[]) => {
	banner = commands
}

export const getBanner = (): string[] => banner

/**
 * Le mot d'accueil. Il ne peut pas vivre dans la definition de la
 * commande, qui est un objet fige : le consommateur le donne en prop, la
 * commande le lit au moment de s'executer.
 */
let welcome: Translatable = ""

export const setWelcome = (text: Translatable) => {
	welcome = text
}

export const getWelcome = (): Translatable => welcome
