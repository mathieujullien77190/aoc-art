import { Translatable } from "_i18n"

import { app, pkg } from "_components/constants"

/** Targets and the URL each opens. The key is the typed argument. */
export const FS_LINKS: Record<string, string> = {
	git: pkg.repo,
	storybook: pkg.storybook,
}

export const FS_TARGETS = Object.keys(FS_LINKS)

/** A new tab, not a navigation: the desktop is a session. */
export const openFlowerShell = (target: string) => {
	const url = FS_LINKS[target]
	if (url) window.open(url, "_blank", "noopener")
}

/** What the shell says while the tab opens, or with no argument */
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

	// no argument: present the package and its two links
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
