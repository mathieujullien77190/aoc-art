# aoc-art

Terminal rétro jouable dans le navigateur : séquence de boot, BIOS, gestionnaire
de fenêtres, puis un shell qui exécute des commandes. Les « jeux » sont des
visualisations animées en ASCII de puzzles Advent of Code.

## Stack

Next 16 (Pages Router, Turbopack) · React 19 · Redux Toolkit 2 · styled-components 6
· TypeScript 5.9 (`strict: false`) · export statique (`output: "export"` → `out/`).

Node 24, épinglé par `engines.node` dans `package.json` — ce champ prend le dessus
sur le réglage du dashboard Vercel, donc la version du runtime vit dans le repo.

## Conventions de travail

- **Ne pas commiter de sa propre initiative.** Enchaîner les modifications et
  s'arrêter là. On commite uniquement quand c'est demandé — pas après chaque
  tâche, pas « pour sécuriser », pas en fin de série.
- **Ne pas tester via Claude in Chrome** sauf demande explicite. Par défaut, la
  vérification se limite à `tsc`, `lint` et `build`. Ouvrir le navigateur prend
  du temps et n'est utile que si on le demande.
- **Ne pas pousser** sans demande explicite.
- **Commits directs sur `master`.** Pas de branche : projet solo, une branche
  n'ajoute qu'un merge et un `--set-upstream` pour rien.
- **Aucune mention de Claude ou d'Anthropic** nulle part : ni trailer
  `Co-Authored-By`, ni dans les messages de commit, ni dans les fichiers.
- Quand un commit est demandé : message en anglais, un commit par correction,
  avec une ligne expliquant le pourquoi.

### Stager sans emporter ce fichier

`CLAUDE.md` n'est ni suivi ni dans `.gitignore` : un `git add -A` l'embarquerait.
Utiliser à la place :

```sh
git add -A -- ':!CLAUDE.md'
```

Le `:!` est un pathspec d'exclusion ; les guillemets sont nécessaires pour que
le shell ne l'interprète pas. Fonctionne aussi bien sous PowerShell que bash.

## Architecture

```
pages/index.tsx            page unique, monte le terminal
components/ComputerLayout/ BIOS, Computer, Window, Windows, Icon — le faux OS
components/Command/         rendu d'une ligne de commande
commands/commands.tsx       définition des commandes (nom, action, help)
games/core/dayN.ts          logique du puzzle, génère les frames
games/components/days/      rendu React d'un jour
games/components/hooks.ts   useAnim : boucle d'animation (index, vitesse, pause)
store/                      slices RTK : global (langue, animation), history
```

Le mapping index → jour est dans `games/constants.tsx`, et il ne suit pas les
numéros de fichier : `aoc 10` lance `day8.ts` (2023-08). Vérifier avant de tester.

## Pièges rencontrés

- **Alias de chemins** (`_components`, `_games`, `_store`…) : résolus par
  `tsconfig.json` (`"paths": { "_*": ["./*"] }`), pas par une config webpack.
  Ne pas réintroduire de bloc `webpack` dans `next.config.js` : Next 16 fait
  échouer le build s'il en trouve un, Turbopack étant le défaut.
- **Fins de ligne mélangées** (CRLF et LF selon les fichiers). Un remplacement
  de chaîne multi-lignes échoue silencieusement sur les fichiers CRLF —
  détecter la convention par fichier, ou travailler ligne par ligne.
- **Doublons de code** : plusieurs fichiers contiennent la même ligne à des
  endroits différents (deux `let i = 0` dans `day8.ts`). Cibler par numéro de
  ligne avec vérification du contenu, jamais par simple recherche de texte.
- **Verrou du serveur dev** : Next 16 refuse un second `next dev` sur le même
  projet. Tuer par port (`Get-NetTCPConnection -LocalPort 3000`), pas par nom
  de process.
- `next-env.d.ts` est ignoré par git : Next le réécrit entre `dev` et `build`,
  ce qui salissait l'arbre en permanence.
- `agentRules: false` et `devIndicators: false` dans `next.config.js` empêchent
  Next de générer ses fichiers d'agent et d'afficher son badge de dev.

## Vérifier une modification

```
npx tsc --noEmit     # doit être à 0
npm run lint         # voir plus bas pour le niveau attendu
npm run build        # export statique
```

Ces trois-là suffisent par défaut.

Le lint ne tourne plus pendant `next build` depuis Next 16 : c'est un script à
part. Il reste ~32 erreurs connues et assumées — bruit du React Compiler
(`exhaustive-deps`, `set-state-in-effect`) sur du code d'animation où
`setState` dans un timer est le bon pattern, plus quelques `any` hérités.
Ne pas « corriger » ces règles sans en parler : ça casserait du code qui marche.

Il n'y a aucun test automatisé dans le projet. Si une vérification navigateur
est demandée, les chemins qui valent le coup : saisie d'une commande, historique
haut/bas, `aoc list`, lancer un jour, DEL au boot pour le BIOS, glisser la
fenêtre par sa barre de titre. Sinon, s'en tenir aux trois commandes ci-dessus
et signaler ce qui n'a pas pu être vérifié.
