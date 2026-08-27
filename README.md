# Flower Shell

Un faux ordinateur rétro, jouable dans le navigateur : séquence de boot, BIOS,
gestionnaire de fenêtres, puis un shell qui exécute des commandes. Les « jeux »
sont des visualisations animées en ASCII de puzzles [Advent of Code](https://adventofcode.com).

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

Quatre icônes, une barre des tâches, des fenêtres déplaçables :

| Icône           | Ouvre                                   |
| --------------- | --------------------------------------- |
| 🌼 Flower Shell | le terminal                             |
| 📡 1/PRISM      | des flux de caméras rendus en ASCII     |
| 📄 CV           | le CV, en ASCII dans le shell ou en PDF |
| 💡 Aide         | la visite guidée                        |

- Cliquer une icône déjà au premier plan referme sa fenêtre.
- La fenêtre se déplace par sa barre de titre, se redimensionne au double-clic.
- **[SUPPR] pendant le boot** ouvre le BIOS : vitesse de démarrage, vieil écran,
  écran bleu fatal.
- Le PDF du CV plante volontairement la machine.

## Le shell

- **[TAB]** complète la commande commencée, **[HAUT]/[BAS]** rejouent l'historique.
- L'URL est un raccourci : `#aoc_1` lance `aoc 1` au chargement (`_` = espace).

### Commandes

| Commande                                     | Effet                                                |
| -------------------------------------------- | ---------------------------------------------------- |
| `help`                                       | liste toutes les commandes                           |
| `help [commande]`                            | l'aide d'une commande précise                        |
| `aoc list`                                   | liste les scripts disponibles (16 jours)             |
| `aoc [index]`                                | `aoc 1` lance « Calorie Counting »                   |
| `aoc [année]-[jour]`                         | `aoc 2022-12` lance « Hill Climbing Algorithm »      |
| `aoc [texte]`                                | `aoc cuc` lance « Sea Cucumber »                     |
| `cv`                                         | le CV complet                                        |
| `cv [timeline \| xp \| skills \| formation]` | une seule section                                    |
| `prism`                                      | ouvre 1/PRISM                                        |
| `tuto`                                       | rejoue la visite guidée                              |
| `about`                                      | qui, avec quoi                                       |
| `hello [texte]`                              | affiche `Hello [texte]`                              |
| `flowers`                                    | plante des fleurs 🌼                                 |
| `stux`                                       | fonctionnalité expérimentale et inutile              |
| `animation [on \| off]`                      | écriture lettre par lettre des réponses              |
| `lang [fr \| en \| leet \| xleet \| #]`      | langue des textes (les commandes restent en anglais) |
| `clear`                                      | efface l'écran, garde l'historique                   |

Les commandes internes — `welcome`, `title`, `unknow`, `argumenterror`,
`closeaoc` — sont marquées `restricted` : le shell les joue lui-même, les taper
ne donne rien.

## La visite guidée

Elle démarre seule à la première venue, se relance par l'icône 💡 ou la commande
`tuto`, et retient qu'elle a été vue dans le `localStorage`. Chaque étape pose un
projecteur sur un élément marqué `data-tutorial` et une bulle à côté ; certaines
attendent que vous jouiez la commande demandée pour passer à la suivante.

## Architecture

```
pages/index.tsx             page unique, monte le terminal et la visite
components/ComputerLayout/  BIOS, Computer, Window, Windows, Icon, Tutorial
components/Terminal/        le shell : commandes rendues + saisie
components/Command/         rendu d'une ligne de commande
commands/commands.tsx       définition des commandes (nom, action, help)
games/core/dayN.ts          logique du puzzle, génère les frames
games/components/days/      rendu React d'un jour
store/                      slices RTK : global, history
projects/prism/             1/PRISM
```

Le mapping index → jour vit dans `games/constants.tsx` et ne suit pas les numéros
de fichier : `aoc 10` lance `day8.ts` (2023-08).

## Stack

Next 16 (Pages Router, Turbopack) · React 19 · Redux Toolkit 2 ·
styled-components 6 · TypeScript 5.9 · export statique (`output: "export"`).
