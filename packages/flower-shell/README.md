# flower-shell

Un terminal rétro en React : moteur de commandes, historique, autocomplétion,
rendu ASCII animé, et une fenêtre pour le poser. Aucune mise en page imposée.

```tsx
import { Shell, baseCommands } from "flower-shell"

const App = () => <Shell commands={baseCommands} />
```

## Le composant

| prop | rôle |
| --- | --- |
| `commands` | les commandes connues : celles du paquet, plus les vôtres |
| `showTitle` | affiche le logo ASCII du shell au démarrage |
| `welcome` | mot d'accueil affiché sous le logo |
| `banner` | commandes restreintes rejouées derrière le logo, au démarrage et après un `clear` |
| `theme` | couleurs, invite, fleurs |
| `lang` | langue de départ (`fr` par défaut) |
| `scrollRef` | élément à faire défiler quand la sortie s'allonge |
| `onCommand` | appelé à chaque commande jouée, y compris celles du paquet |
| `window` | pose le terminal dans un cadre ; voir plus bas |

## Les commandes de base

`help`, `clear`, `hello`, `flowers`, `animation`, `lang`, plus trois commandes
restreintes — que le visiteur ne peut pas taper :

- `title` affiche le logo ASCII du shell et `welcome` le mot d'accueil ; les
  props `showTitle` et `welcome` les jouent pour vous, sinon le shell démarre
  nu et vous posez votre propre marque
- `unknow` et `argumenterror` sont cherchées **par nom** par le moteur, qui
  rend leur texte quand une commande est inconnue ou mal appelée. Les retirer
  est permis : un message interne prend le relais, et `commands={[]}` reste un
  shell valide, qui ne répond simplement à rien

## Écrire une commande

```tsx
const hello: BaseCommand = {
	restricted: false,
	name: "ping",
	action: () => ({ fr: "pong", en: "pong" }),
	effect: () => console.log("joué"),
	help: {
		patterns: [
			{ pattern: "ping", description: { fr: "répond pong", en: "answers pong" } },
		],
	},
}
```

| champ | rôle |
| --- | --- |
| `action` | le texte affiché ; une chaîne, ou une variante par langue |
| `effect` | l'effet de bord ; la commande attaque votre état elle-même |
| `JSX` | rendu React sous la sortie, pour une commande qui affiche mieux qu'un texte |
| `testArgs` | arguments acceptés (`authorize`, `empty`) |
| `display` | animation, styles, coloration personnalisée |
| `restricted` | vraie si le visiteur ne peut pas la taper ; réservée au code |

## La fenêtre

Le shell se pose dans un cadre rétro — barre de titre à glisser, agrandissement,
fermeture — en lui passant la prop `window`. Elle n'a pas vocation à servir
seule, d'où son passage par le shell plutôt qu'un composant à part.

```tsx
const container = useRef<HTMLDivElement>(null)

;<div ref={container} style={{ position: "relative", height: "100vh" }}>
	<Shell
		commands={baseCommands}
		window={{ show: true, title: "flower-shell", container, onClose }}
	/>
</div>
```

| champ de `window` | rôle |
| --- | --- |
| `show` | montée ou non ; la fermeture s'anime avant de démonter |
| `container` | le cadre borne le déplacement à cet élément |
| `title` | le texte de la barre |
| `bottomInset` | hauteur réservée en bas, pour une barre des tâches |
| `compact` | pleine et non redimensionnable |
| `layer` | étage d'empilement |
| `rank` | rang dans la cascade, pour ne pas s'ouvrir sur la précédente |
| `onFocus` / `onClose` | la fenêtre réclame le premier plan, ou se ferme |

`compact` retire le bouton d'agrandissement et le double-clic. Le paquet ne
fixe aucun seuil : c'est à qui l'affiche de décider quand — petit écran, mode
lecture, préférence.

## Le balisage du texte

Les réponses passent par une passe de coloration :

| marqueur | effet |
| --- | --- |
| `` `texte` `` | commande cliquable, qui se rejoue au clic |
| `$texte$` | fond vert, texte noir |
| `§texte§` | couleur d'accent |
| `+texte+` | couleur d'information |

Un marqueur précédé de `£` s'affiche tel quel.

## Les langues

`fr`, `en`, et `#` — le mode fleuri, qui remplace chaque lettre par une fleur,
différente pour les voyelles, les consonnes et les chiffres. Un texte peut être
une chaîne simple ou `{ fr, en }` ; le mode fleuri dérive du français.

## Le thème

```tsx
<Shell
	commands={commands}
	theme={{
		colors: { background: "#212E35", importantColor: "#FFCC6A" },
		prompt: "🌼",
		flowers: { vowel: "🌸", consonant: "🌼", digit: "🌻" },
		fonts: { shell: "monospace", window: "monospace" },
		window: { titleBar: "#ed612e", content: "#f4ebda" },
	}}
/>
```

Les valeurs absentes gardent celles de `defaultTheme`, y compris à
l'intérieur d'un groupe : ne donner que `colors.background` laisse les autres
couleurs en place.

Les deux polices sont séparées — un terminal veut du chasse fixe, un cadre pas
forcément — et valent `monospace` par défaut. Le cadre pose la sienne
explicitement : sans elle, il hériterait de la page qui l'accueille.

## Hors composant

L'état vit dans des modules, pas dans un contexte : une commande peut donc être
jouée depuis n'importe où — une fenêtre qui se ferme, un jeu qui se termine.

```ts
import { run, runRestricted, shellActions, useLang } from "flower-shell"

run("help")             // comme si le visiteur l'avait tapée
runRestricted("title")  // une commande que le visiteur ne peut pas taper
shellActions().setLang("en")
shellActions().reset()   // historique vide, options par defaut
```

**Conséquence assumée : un shell par page.** Le registre des commandes et le
thème sont des modules ; deux terminaux monteraient l'un sur l'autre.

## Développer

```sh
npm run shell:storybook   # le terminal seul, sans le reste du site
```

Les stories montrent le shell nu, avec des commandes personnalisées, et avec un
autre thème.

## Licence

MIT.
