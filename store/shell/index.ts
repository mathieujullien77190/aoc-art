import type { ShellControls, ShellState } from "flower-shell"

/**
 * Le nom sous lequel le terminal de la page est joignable. Le paquet ne
 * tient plus de shell unique : on l'adresse par son id, et un seul vit
 * ici.
 */
export const SHELL_ID = "main"

/**
 * La poignee du terminal, posee par la page au montage. useShell() est un
 * hook : une commande, qui n'est pas un rendu React, ne peut pas
 * l'appeler — elle passe par ce relais.
 */
let controls: ShellControls | null = null

export const bindShell = (next: ShellControls) => {
	controls = next
}

/** joue une ligne dans le terminal, comme si elle avait ete tapee */
export const shellRun = (pattern: string) => controls?.run(SHELL_ID, pattern)

/** joue une ligne que le visiteur ne peut pas taper */
export const shellRunRestricted = (pattern: string) =>
	controls?.runRestricted(SHELL_ID, pattern)

/** frames d'attente avant d'abandonner la ligne */
const WAIT_FRAMES = 10

/**
 * Joue une ligne, meme si le terminal vient tout juste d'etre demande.
 * Une icone du bureau ouvre la fenetre et lance sa commande dans le meme
 * clic : le shell, demonte tant que la fenetre est fermee, ne s'inscrit
 * qu'au rendu suivant, et le paquet leve sur un id absent. On attend donc
 * qu'il soit la, quelques frames au plus.
 */
export const shellRunWhenReady = (pattern: string, left = WAIT_FRAMES) => {
	if (shellState()) {
		shellRun(pattern)
		return
	}

	if (left <= 0) return

	requestAnimationFrame(() => shellRunWhenReady(pattern, left - 1))
}

/**
 * L'etat du terminal, lu a l'instant : langue, options, historique.
 *
 * Le paquet leve quand aucun shell ne porte l'id — c'est une erreur de
 * cablage, pas un cas courant. Mais la langue se lit depuis des rendus,
 * et l'ecran entier tomberait pour ca : ici, rien plutot qu'une levee.
 */
export const shellState = (): ShellState | undefined => {
	try {
		return controls?.actions(SHELL_ID)
	} catch {
		return undefined
	}
}
