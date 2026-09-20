# Flower Shell

Un faux ordinateur rétro, jouable dans le navigateur : séquence de boot, BIOS,
gestionnaire de fenêtres, puis un shell qui exécute des commandes. Les « jeux »
sont des visualisations animées en ASCII de puzzles [Advent of Code](https://adventofcode.com).

Le terminal lui-même est un paquet npm à part, [flower-shell](https://github.com/mathieujullien77190/flower-shell)
([storybook](https://mathieujullien77190.github.io/flower-shell/)) : ce site
l'installe, lui donne ses commandes et le pose dans une fenêtre du bureau.

Par JULLIEN Mathieu (SuperMatou).

## Démarrer

```sh
npm install
npm run dev       # http://localhost:3000
```

```sh
npm run build     # export statique dans out/
npm run lint
npx tsc --noEmit
```

Node 24 (épinglé par `engines.node`).

## Le bureau

Des icônes, une barre des tâches, des fenêtres déplaçables :

| Icône                | Fait                                          |
| -------------------- | --------------------------------------------- |
| 🌼 Flower Shell      | ouvre le terminal                             |
| 🎄 Advent of Code    | joue `aoc list` dans le shell                 |
| 📡 1/PRISM           | ouvre des flux de caméras rendus en ASCII     |
| 📖 Doc Flower Shell  | ouvre le storybook du paquet dans une fenêtre |
| 📄 CV (dans le coin) | joue `cv` dans le shell                       |

- Une icône qui joue une commande ouvre le shell en grand : les sorties sont
  larges, une fenêtre moyenne les replierait.
- Une fenêtre rouvre telle qu'on l'a fermée, taille et position.
- Cliquer l'icône d'une fenêtre déjà au premier plan la referme ; cachée
  derrière une autre, elle remonte. Le shell fermé repart vide.
- La fenêtre se déplace par sa barre de titre, s'agrandit au double-clic. Sous
  1024 px, les fenêtres restent pleines.
- **[SUPPR] pendant le boot** ouvre le BIOS : vitesse de démarrage, vieil écran,
  écran bleu fatal.

## Le shell

- **[TAB]** complète la commande commencée, **[HAUT]/[BAS]** rejouent l'historique.
- Certains textes sont cliquables et jouent leur commande (le lien PDF du CV).
- L'URL suit la dernière commande jouée : `aoc 5` donne `/aoc/5`, `cv xp` donne
  `/cv/xp`. Ouvrir cette adresse rejoue la commande au chargement. Les lignes
  sans page (`clear`, arguments libres comme `theme flower`) remettent `/`.
  L'ancien `#aoc_1` lance encore `aoc 1` (`_` = espace).

### Commandes du site

| Commande                                     | Effet                                                |
| -------------------------------------------- | ---------------------------------------------------- |
| `aoc list`                                   | liste les scripts disponibles (16 jours)             |
| `aoc [index]`                                | `aoc 1` lance « Calorie Counting »                   |
| `aoc [année]-[jour]`                         | `aoc 2022-12` lance « Hill Climbing Algorithm »      |
| `aoc [texte]`                                | `aoc cuc` lance « Sea Cucumber »                     |
| `cv`                                         | le CV complet                                        |
| `cv [timeline \| xp \| skills \| formation]` | une seule section                                    |
| `cv pdf`                                     | télécharge le CV en PDF                              |
| `prism`                                      | ouvre 1/PRISM                                        |
| `flower-shell`                               | présente le paquet du terminal                       |
| `flower-shell [git \| storybook]`            | ouvre le dépôt ou le storybook dans un nouvel onglet |
| `about`                                      | qui, avec quoi                                       |
| `stux`                                       | fonctionnalité expérimentale et inutile              |

### Commandes du paquet

| Commande                 | Effet                                                  |
| ------------------------ | ------------------------------------------------------ |
| `help`                   | liste toutes les commandes                             |
| `help [commande]`        | l'aide d'une commande précise                          |
| `hello [texte]`          | affiche `Hello [texte]`                                |
| `flowers`                | plante des fleurs 🌼 — le bureau en sème sur les côtés |
| `animation [on \| off]`  | écriture lettre par lettre des réponses                |
| `lang [fr \| en]`        | langue des textes, suivie par le bureau                |
| `theme [nom]`            | change les couleurs ; `help theme` liste les huit      |
| `font [+ \| - \| reset]` | taille du texte                                        |
| `test`                   | montre les couleurs et balises du rendu                |
| `clear`                  | efface l'écran et remet le bureau à neuf               |

Les commandes internes — `welcome`, `title`, `unknow`, `argumenterror`,
`actionmap`, `closeaoc` — sont marquées `restricted` : le shell les joue
lui-même, les taper ne donne rien.

## Architecture

```
app/page.tsx                accueil : monte le bureau et le shell (components/Home)
app/[...command]/           une page statique par ligne de commande (commands/routes.ts)
app/layout.tsx              <html>, metadonnees, registre styled-components
components/ComputerLayout/  BIOS, Computer, Windows, Icon — le faux OS
components/Window/          la fenêtre : déplacement, taille, fermeture
components/Storybook/       la doc du paquet, en iframe
commands/commands.tsx       les commandes du site (action, effect, help)
games/core/dayN.ts          logique du puzzle, génère les frames
games/components/days/      rendu React d'un jour
store/global/               état du bureau (zustand) : langue, fenêtres…
store/shell/                relais vers le terminal, pour les commandes
projects/prism/             1/PRISM
```

Le mapping index → jour vit dans `games/constants.tsx` et ne suit pas les numéros
de fichier : `aoc 10` lance `day8.ts` (2023-08).

## Stack

Next 16 (Pages Router, Turbopack) · React 19 · zustand 5 · styled-components 6
· TypeScript 5.9 · [flower-shell](https://www.npmjs.com/package/flower-shell) ·
export statique (`output: "export"`).
