import { Translatable } from "_i18n"

import { app, pkg } from "_components/constants"

/**
 * Les cibles de la commande, et l'adresse que chacune ouvre. Le nom de la
 * cle est l'argument tape : ajouter une destination tient en une ligne,
 * l'aide et la validation des arguments la suivent d'elles-memes.
 */
export const FS_LINKS: Record<string, string> = {
	git: pkg.repo,
	storybook: pkg.storybook,
}

export const FS_TARGETS = Object.keys(FS_LINKS)

/**
 * Un onglet plutot qu'une navigation : le bureau est une session, on ne
 * quitte pas la machine pour aller lire un depot. `noopener` coupe l'acces
 * de la page ouverte a celle-ci, comme pour le CV.
 */
export const openFlowerShell = (target: string) => {
	const url = FS_LINKS[target]
	if (url) window.open(url, "_blank", "noopener")
}

/** ce que le shell dit pendant que l'onglet s'ouvre, ou sans argument */
export const flowerShellSays = (target: string): Translatable => {
	if (target === "git")
		return {
			fr: "\n§Ouverture du dépôt GitHub…§\n",
			en: "\n§Opening the GitHub repository…§\n",
		}

	if (target === "storybook")
		return {
			fr: "\n§Ouverture du storybook…§\n",
			en: "\n§Opening the storybook…§\n",
		}

	// sans argument, la commande presente le paquet et ses deux portes
	return {
		fr: [
			`\n| $${app.name}$`,
			"| Le terminal de ce site, sorti en paquet npm",
			"| +flower-shell git+ => le dépôt sur GitHub",
			"| +flower-shell storybook+ => la doc des composants",
		].join("\n"),
		en: [
			`\n| $${app.name}$`,
			"| The terminal of this site, released as an npm package",
			"| +flower-shell git+ => the repository on GitHub",
			"| +flower-shell storybook+ => the component docs",
		].join("\n"),
	}
}
