import { Translatable } from "retro-shell"

import { app } from "_components/constants"

/** sections affichables une par une : +cv xp+, +cv skills+... */
export const CV_SECTIONS = ["timeline", "xp", "skills", "formation"]

/**
 * Le CV complet saute l'experience detaillee : la frise la resume deja,
 * les deux d'affilee feraient doublon. Elle reste accessible par +cv xp+.
 */
const FULL_SECTIONS = CV_SECTIONS.filter(key => key !== "xp")

/** largeur interieure de la page, bordures comprises */
const WIDTH = 74

type Lang = "fr" | "en"

const LANGS: Lang[] = ["fr", "en"]

const JOB: Record<Lang, string> = {
	fr: "Développeur JavaScript",
	en: "JavaScript developer",
}

const PLACE: Record<Lang, string> = {
	fr: "Dammarie-les-Lys (77) · Île-de-France · permis B",
	en: "Dammarie-les-Lys (77) · Paris area · driving licence",
}

const TITLES: Record<string, Record<Lang, string>> = {
	timeline: { fr: "PARCOURS", en: "TIMELINE" },
	xp: { fr: "EXPÉRIENCE", en: "EXPERIENCE" },
	skills: { fr: "COMPÉTENCES", en: "SKILLS" },
	formation: { fr: "FORMATION", en: "EDUCATION" },
}

const LINES: Record<string, Record<Lang, string[]>> = {
	xp: {
		fr: [
			"§2016 – 2026 · SeLoger — Paris§",
			"  Dépôt d'annonce : formulaire multipage (Typeform, React",
			"  Router), gestion des annonces et des candidatures, suivi des",
			"  prospects en liste, en comparaison et en kanban (drag and",
			"  drop, skeletons). Multilingue via Lokalize, déployé pour",
			"  SeLoger France et Immowelt Allemagne.",
			"",
			"  Moteur de recherche et pages de résultats : refonte du",
			"  composant historique en React / TypeScript, Redux, React Hook",
			"  Form, styled-components — Vue et Svelte sur quelques briques.",
			"  Tracking, publicité, lazy loading, CI CircleCI, tests Jest.",
			"",
			"  Carto Search : Bing Maps vers MapBox, Redux / RxJs / Turf,",
			"  recherche isochrone, données temps réel en WebSocket.",
			"",
			"§2014 – 2016 · Numericable — Paris§",
			"  VIZIR, SIG du réseau fibre : application C# / Oracle, auth",
			"  LDAP, modules de recherche et d'édition en ArcGIS js / Dojo.",
			"  Librairie carto ArcGIS réutilisable par les applis internes",
			"  (tests Jasmine, builds Grunt, documentation générée).",
			"  Web services SOAP : requêtes géographiques, réponses aux DICT.",
			"",
			"§2011 – 2014 · Michelin Travel Partner — Paris§",
			"  Widgets de guidage embarqués sur automobile PSA (JS / HTML5,",
			"  iPad, Android, SMEG), feuille de route embarquée, tests",
			"  véhicule. Guide Vert, Guide Michelin, Trafic.",
			"  B2C : refonte de la page hôtel Viamichelin.",
			"  APIJs : modules du framework maison, complétion multi-sources.",
			"",
			"§2010 – 2011 · Arboetsens — Paris§ (stage M2)",
			"  Boutique en ligne pilotée en Ajax, CMS multilingue, outil de",
			"  saisie de newsletters (Mootools, ExtJs, jQuery).",
		],
		en: [
			"§2016 – 2026 · SeLoger — Paris§",
			"  Listing submission: multi-page form (Typeform, React Router),",
			"  listing and application management, applicant tracking as a",
			"  list, a side-by-side comparison and a kanban board (drag and",
			"  drop, skeletons). Localised with Lokalize, shipped for",
			"  SeLoger in France and Immowelt in Germany.",
			"",
			"  Search engine and result pages: rewrote the legacy component",
			"  in React / TypeScript, Redux, React Hook Form and",
			"  styled-components — Vue and Svelte on a few parts.",
			"  Tracking, ads, lazy loading, CircleCI, Jest tests.",
			"",
			"  Carto Search: Bing Maps to MapBox, Redux / RxJs / Turf,",
			"  isochrone search, live data over WebSocket.",
			"",
			"§2014 – 2016 · Numericable — Paris§",
			"  VIZIR, fibre network GIS: C# / Oracle app, LDAP auth, search",
			"  and editing modules built on ArcGIS js / Dojo.",
			"  Reusable ArcGIS mapping library for internal apps (Jasmine",
			"  tests, Grunt builds, generated documentation).",
			"  SOAP web services: geographic queries and DICT answers.",
			"",
			"§2011 – 2014 · Michelin Travel Partner — Paris§",
			"  In-car navigation widgets for PSA vehicles (JS / HTML5, iPad,",
			"  Android, SMEG), embedded roadbook, on-vehicle test campaigns.",
			"  Guide Vert, Guide Michelin, Traffic.",
			"  B2C: rebuilt the Viamichelin hotel page.",
			"  APIJs: modules for the in-house framework, autocompletion.",
			"",
			"§2010 – 2011 · Arboetsens — Paris§ (master's internship)",
			"  Ajax-driven online shop, multilingual CMS, newsletter",
			"  authoring tool (Mootools, ExtJs, jQuery).",
		],
	},
	skills: {
		fr: [
			"§Web§        HTML5, CSS3, JavaScript, TypeScript",
			"§Maîtrise§   React (hooks, context, Redux, React Hook Form,",
			"            styled-components, Tailwind), NodeJs",
			"§Bases§      Vue, Svelte, Electron, jQuery, AngularJs, C#, Python",
			"§Outils§     git, VSCode / Copilot, CircleCI, Jenkins, Jira, Figma",
			"§Méthodes§   agile (kanban, scrum), pair programming",
			"§Langue§     anglais écrit et technique",
		],
		en: [
			"§Web§        HTML5, CSS3, JavaScript, TypeScript",
			"§Strong§     React (hooks, context, Redux, React Hook Form,",
			"            styled-components, Tailwind), NodeJs",
			"§Basics§     Vue, Svelte, Electron, jQuery, AngularJs, C#, Python",
			"§Tools§      git, VSCode / Copilot, CircleCI, Jenkins, Jira, Figma",
			"§Methods§    agile (kanban, scrum), pair programming",
			"§Language§   French native, technical English",
		],
	},
	formation: {
		fr: [
			"§2010§  Master MIAGE option SIR — université d'Orléans",
			"§2007§  DUT informatique — IUT Claude Bernard, Lyon 1",
			"§2005§  Baccalauréat scientifique, spécialité mathématiques",
			"",
			"        Menuiserie · ornithologie",
		],
		en: [
			"§2010§  MIAGE master's degree, SIR track — university of Orléans",
			"§2007§  Computer science degree — IUT Claude Bernard, Lyon 1",
			"§2005§  Science baccalaureate, mathematics major",
			"",
			"        Woodworking · birdwatching",
		],
	},
}

/** separateurs de mise en couleur, dans l'ordre ou le rendu les consomme */
const MARKERS = ["§", "+", "#", "$"]

/** un marqueur precede de £ s'affiche tel quel, il ne fait donc pas paire */
const ESCAPE = "£"

/** le marqueur echappe, mis de cote le temps du calcul */
const HIDDEN = String.fromCharCode(0)

/**
 * Longueur reellement affichee : les separateurs disparaissent au rendu,
 * les compter decalerait la bordure droite.
 *
 * Ils ne comptent que par paires, comme a l'affichage : le `#` isole de
 * `C#` reste a l'ecran, le retirer decalait la ligne d'une colonne.
 */
const visible = (line: string) => {
	// hors jeu avant l'appariement, comme le fait le rendu
	const escaped = MARKERS.reduce(
		(text, marker) => text.split(`${ESCAPE}${marker}`).join(HIDDEN),
		line
	)

	return MARKERS.reduce(
		(text, marker) =>
			text.replace(
				new RegExp(`[${marker}]([^${marker}]*)[${marker}]`, "g"),
				"$1"
			),
		escaped
	).length
}

/** place disponible entre les bordures, marges comprises */
const INNER = WIDTH - 6

/** ligne de contenu, bordee a gauche et a droite */
const row = (line = "") =>
	`|  ${line}${" ".repeat(Math.max(0, INNER - visible(line)))}  |`

/**
 * Decale une ligne pour la centrer dans la page. `width` permet de centrer
 * un bloc entier sur sa ligne la plus longue, sinon ses lignes partiraient
 * chacune d'un bord different et le dessin serait deforme.
 */
const center = (line: string, width = visible(line)) =>
	" ".repeat(Math.max(0, Math.floor((INNER - width) / 2))) + line

/**
 * Boite fermee, coins en diagonale :
 *
 *   ______
 *  /      \\
 *  |      |
 *  \\______/
 */
const box = (lines: string[]) => [
	`£+${"-".repeat(WIDTH - 2)}£+`,
	...lines,
	`£+${"-".repeat(WIDTH - 2)}£+`,
]

/**
 * Le nom en grand, en deux blocs empiles : d'un seul tenant il ferait 83
 * colonnes, soit plus que la largeur de la page.
 */
const BANNER = [
	" __  __       _   _     _",
	"|  \\/  | __ _| |_| |__ (_) ___ _   _",
	"| |\\/| |/ _` | __| '_ \\| |/ _ \\ | | |",
	"| |  | | (_| | |_| | | | |  __/ |_| |",
	"|_|  |_|\\__,_|\\__|_| |_|_|\\___|\\__,_|",
	"",
	"     _ _   _ _     _     ___ _____ _   _",
	"    | | | | | |   | |   |_ _| ____| \\ | |",
	" _  | | | | | |   | |    | ||  _| |  \\| |",
	"| |_| | |_| | |___| |___ | || |___| |\\  |",
	" \\___/ \\___/|_____|_____|___|_____|_| \\_|",
]

/** le bloc du nom se centre d'un seul tenant, sur sa ligne la plus large */
const BANNER_WIDTH = Math.max(...BANNER.map(line => line.length))

/** mot d'accueil, sous l'etat civil */
const INTRO: Record<Lang, string[]> = {
	fr: [
		"Développeur front end depuis quinze ans, dont dix chez SeLoger,",
		"sur le moteur de recherche et la cartographie.",
		"",
		"Je cherche une nouvelle mission en React / TypeScript, en",
		"Île-de-France.",
	],
	en: [
		"Front end developer for fifteen years, ten of them at SeLoger,",
		"on the search engine and the mapping stack.",
		"",
		"Now looking for a new React / TypeScript position, around Paris",
	],
}

const header = (lang: Lang) =>
	box([
		row(),
		...BANNER.map(line => row(line ? center(`§${line}§`, BANNER_WIDTH) : "")),
		row(),
		row(center(JOB[lang])),
		row(),
		row(center(`§${PLACE[lang]}§`)),
		row(center(`§${app.email}§`)),
		row(),
		...INTRO[lang].map(line => row(line)),
		row(),
	])

/**
 * Frise : les annees tiennent la colonne centrale, les postes sont a
 * gauche, les competences prises cette annee-la a droite.
 *
 * Les annees sans repere dans le CV portent une competence plausible
 * plutot qu'un vide — a reordonner.
 */
const TIMELINE: {
	year: string
	left?: Record<Lang, string>
	right?: string
}[] = [
	{
		year: "2005",
		left: { fr: "Bac scientifique", en: "Science baccalaureate" },
	},
	{
		year: "2007",
		left: { fr: "Qualéa Lyon · stage DUT", en: "Qualéa Lyon · internship" },
		right: "HTML, CSS, PHP",
	},
	{ year: "2008", right: "JavaScript, MySQL, SQL" },
	{
		year: "2008",
		left: { fr: "INRA Orléans · stage L3", en: "INRA Orléans · internship" },
		right: "PostgreSQL, SVN",
	},
	{ year: "2009", right: "Java, UML" },
	{
		year: "2010",
		left: { fr: "Arboetsens · stage M2", en: "Arboetsens · internship" },
		right: "Ajax, Mootools, ExtJs",
	},
	{
		year: "2011",
		left: { fr: "Michelin Travel Partner", en: "Michelin Travel Partner" },
		right: "GMaps",
	},
	{ year: "2012", right: "HTML5, CSS3, Jasmine" },
	{ year: "2013", right: "Grunt, Jenkins, JSON" },
	{
		year: "2014",
		left: { fr: "Numericable", en: "Numericable" },
		right: "Dojo, ArcGIS, C#",
	},
	{ year: "2015", right: "Oracle, LDAP, SOAP" },
	{
		year: "2016",
		left: { fr: "SeLoger", en: "SeLoger" },
		right: "React, Redux",
	},
	{ year: "2017", right: "Webpack, Sass" },
	{ year: "2018", right: "TypeScript, Jest" },
	{ year: "2019", right: "styled-components, RxJs" },
	{ year: "2020", right: "MapBox, Turf, WebSocket" },
	{ year: "2021", right: "CircleCI, React Hook Form" },
	{ year: "2022", right: "Vue, Svelte" },
	{ year: "2023", right: "Tailwind, Lokalize" },
	{ year: "2024", right: "Claude" },
	{ year: "2025", right: "Copilot, Figma" },
	{ year: "2026", right: "NextJs, React 19" },
]

/** largeur d'un cote de la frise, la colonne des annees mise a part */
const HALF = (INNER - 6) / 2

/** cale un texte contre la colonne des annees */
const toCenter = (text: string) =>
	`${" ".repeat(Math.max(0, HALF - visible(text)))}${text}`

type Palier = { year: string; left: string; skills: string[] }

/**
 * Seules les annees avec un poste tiennent une ligne. Les autres versent
 * leurs competences au palier du dessus — la premiere entree de TIMELINE
 * doit donc porter un poste, sinon ses competences n'ont nulle part ou aller.
 */
const paliers = (lang: Lang): Palier[] =>
	TIMELINE.reduce<Palier[]>((acc, entry) => {
		if (entry.left)
			acc.push({ year: entry.year, left: entry.left[lang], skills: [] })

		const last = acc[acc.length - 1]
		if (entry.right && last) last.skills.push(entry.right)

		return acc
	}, [])

/**
 * Competence accrochee a la colonne des annees. Seule la premiere d'un
 * palier tire un trait : le repeter en dessous ferait un peigne.
 */
const skill = (name?: string, leader = "----") =>
	name ? `${leader} +${name}+` : ""

/** la colonne des annees, vide : elle court d'un palier a l'autre */
const gap = () => row(`${toCenter("")}|    |`)

/** un palier : poste a gauche, annee au centre, competences a droite */
const step = (palier: Palier) => [
	row(
		`${toCenter(`${palier.left} ----`)}|§${palier.year}§|${skill(palier.skills[0])}`
	),
	...palier.skills
		.slice(1)
		.map(name => row(`${toCenter("")}|    |${skill(name, "    ")}`)),
]

const LEGEND: Record<Lang, { left: string; right: string }> = {
	fr: { left: "poste", right: "compétences prises" },
	en: { left: "position", right: "skills picked up" },
}

/** les paliers respirent : entre eux la colonne des annees reste tracee */
const timeline = (lang: Lang) => [
	row(
		`${toCenter(`+${LEGEND[lang].left}+     `)}|    |     +${LEGEND[lang].right}+`
	),
	...paliers(lang).flatMap(palier => [gap(), ...step(palier)]),
]

/** la frise se construit, les autres sections se lisent telles quelles */
const body = (key: string, lang: Lang) =>
	key === "timeline" ? timeline(lang) : LINES[key][lang].map(line => row(line))

const section = (key: string, lang: Lang) =>
	box([
		row(`+${TITLES[key][lang]}+`),
		row(`${"_".repeat(INNER)}`),
		row(),
		...body(key, lang),
		row(),
	])

const RULER: Record<Lang, string> = {
	fr: "élargissez la fenêtre pour lire cette ligne d'un seul trait",
	en: "resize your window until this line fits on one row",
}

/**
 * Jauge de largeur : elle fait exactement la largeur de la page, donc
 * si elle se replie sur deux lignes, le reste du CV se repliera aussi.
 */
const ruler = (lang: Lang) => {
	const dashes = WIDTH - RULER[lang].length - 4
	const left = Math.floor(dashes / 2)

	return `<${"-".repeat(left)} ${RULER[lang]} ${"-".repeat(dashes - left)}>`
}

/** les boites se suivent, separees par une ligne vide */
const page = (keys: string[], lang: Lang) =>
	[[ruler(lang)], header(lang), ...keys.map(key => section(key, lang))]
		.map(lines => lines.join("\n"))
		.join("\n\n")

/** une section, ou le CV entier quand aucune n'est demandee */
export const buildCV = (section?: string): Translatable => {
	const keys = section ? [section] : FULL_SECTIONS

	return LANGS.reduce(
		(acc, lang) => ({ ...acc, [lang]: `\n${page(keys, lang)}\n` }),
		{}
	) as Translatable
}
