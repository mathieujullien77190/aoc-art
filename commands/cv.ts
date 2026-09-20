import { Translatable } from "_i18n"

import { app } from "_components/constants"

/** sections shown one at a time: `cv xp`, `cv skills`... */
export const CV_SECTIONS = ["timeline", "xp", "skills", "formation"]

/** the argument that downloads instead of displaying */
export const CV_PDF = "pdf"

/** the line played by the header link */
const CV_PDF_PATTERN = `cv ${CV_PDF}`

/** download link, under the email */
const DOWNLOAD: Record<"fr" | "en", string> = {
	fr: "Télécharger CV PDF",
	en: "Download CV as PDF",
}

/** PDF export of the source document, served as an attachment by Google Docs */
const CV_PDF_URL =
	"https://docs.google.com/document/d/1yBih6xsRqkDgWmfXeWfcJlQsHoSaNvmSXxJ-6DxLcHo/export?format=pdf"

/**
 * Google Docs replies with an attachment: the opened tab downloads it and
 * closes itself. A `download` attribute is ignored cross-origin.
 */
export const downloadCv = () => window.open(CV_PDF_URL, "_blank", "noopener")

/** what the shell says while the tab fetches the file */
export const CV_PDF_SAYS: Translatable = {
	fr: "\n§Téléchargement du CV en PDF…§\n",
	en: "\n§Downloading the resume as a PDF…§\n",
}

/** The full CV skips detailed experience (the timeline covers it); see `cv xp`. */
const FULL_SECTIONS = CV_SECTIONS.filter(key => key !== "xp")

/** inner page width, borders included */
const WIDTH = 74

type Lang = "fr" | "en"

const LANGS: Lang[] = ["fr", "en"]

const JOB: Record<Lang, string> = {
	fr: "Développeur JavaScript front end",
	en: "Front end JavaScript developer",
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
			"§Sept. 2016 – avril 2026 · SeLoger — Paris§",
			"  Dépôt d'annonce (2021 – 2026) : formulaire multipage",
			"  (Typeform, React Router), gestion des annonces et des",
			"  candidatures, suivi des prospects en liste, en comparaison et",
			"  en kanban (drag and drop, skeletons). Multilingue via Lokalise,",
			"  déployé pour SeLoger France et Immowelt Allemagne.",
			"",
			"  Vérification d'identité (2023) : parcours KYC complet en Next,",
			"  upload et contrôle des pièces, reconnaissance faciale par un",
			"  service tiers, reprise du parcours entre desktop et mobile.",
			"",
			"  Carto Search (2018 – 2021) : Bing Maps vers MapBox, Redux /",
			"  RxJs / Turf, recherche isochrone, données temps réel en",
			"  WebSocket.",
			"",
			"  Moteur de recherche et pages de résultats (2016 – 2018) :",
			"  refonte du composant historique en React / TypeScript, Redux,",
			"  React Hook Form, styled-components — Vue et Svelte sur quelques",
			"  briques. Tracking, publicité, lazy loading, CI CircleCI, tests",
			"  Jest.",
			"",
			"§Avril 2014 – juillet 2016 · Numericable — Paris§",
			"  VIZIR, SIG du réseau fibre : application C\\# / Oracle, auth",
			"  LDAP, modules de recherche et d'édition en ArcGIS js / Dojo.",
			"  Librairie carto ArcGIS réutilisable par les applis internes",
			"  (tests Jasmine, builds Grunt, documentation générée).",
			"  Web services SOAP : requêtes géographiques, réponses aux DICT.",
			"",
			"§Févr. 2011 – avril 2014 · Michelin Travel Partner — Paris§",
			"  Widgets de guidage embarqués sur automobile PSA (JS / HTML5,",
			"  iPad, Android, SMEG), feuille de route embarquée, tests",
			"  véhicule. Guide Vert, Guide Michelin, Trafic.",
			"  B2C : refonte de la page hôtel Viamichelin.",
			"  APIJs : modules du framework maison, complétion multi-sources.",
		],
		en: [
			"§Sept. 2016 – April 2026 · SeLoger — Paris§",
			"  Listing submission (2021 – 2026): multi-page form (Typeform,",
			"  React Router), listing and application management, applicant",
			"  tracking as a list, a side-by-side comparison and a kanban",
			"  board (drag and drop, skeletons). Localised with Lokalise,",
			"  shipped for SeLoger in France and Immowelt in Germany.",
			"",
			"  Identity verification (2023): full KYC journey built in Next,",
			"  document upload and checks, third party face recognition,",
			"  resuming the flow across desktop and mobile.",
			"",
			"  Carto Search (2018 – 2021): Bing Maps to MapBox, Redux / RxJs",
			"  / Turf, isochrone search, live data over WebSocket.",
			"",
			"  Search engine and result pages (2016 – 2018): rewrote the",
			"  legacy component in React / TypeScript, Redux, React Hook Form",
			"  and styled-components — Vue and Svelte on a few parts.",
			"  Tracking, ads, lazy loading, CircleCI, Jest tests.",
			"",
			"§April 2014 – July 2016 · Numericable — Paris§",
			"  VIZIR, fibre network GIS: C\\# / Oracle app, LDAP auth, search",
			"  and editing modules built on ArcGIS js / Dojo.",
			"  Reusable ArcGIS mapping library for internal apps (Jasmine",
			"  tests, Grunt builds, generated documentation).",
			"  SOAP web services: geographic queries and DICT answers.",
			"",
			"§Feb. 2011 – April 2014 · Michelin Travel Partner — Paris§",
			"  In-car navigation widgets for PSA vehicles (JS / HTML5, iPad,",
			"  Android, SMEG), embedded roadbook, on-vehicle test campaigns.",
			"  Guide Vert, Guide Michelin, Traffic.",
			"  B2C: rebuilt the Viamichelin hotel page.",
			"  APIJs: modules for the in-house framework, autocompletion.",
		],
	},
	skills: {
		fr: [
			"§Web§        HTML5, CSS3, JavaScript, TypeScript",
			"§Maîtrise§   React, NodeJs",
			"§React§      NextJs, React Router, Redux, Zustand, React Hook",
			"           Form, styled-components, Tailwind",
			"§Notions§    MongoDb, Vue, Svelte, Electron, C\\#, Python, PHP",
			"§Outils§     VSCode (Copilot, Claude), git, CircleCI, Jenkins,",
			"           Webpack, Jira, Confluence",
			"§Méthodes§   agile (kanban, scrum), pair programming, tests",
			"           unitaires (Jest, Jasmine)",
			"§Design§     Figma, Zeplin, GIMP",
			"§Langue§     anglais B1, technique et écrit",
		],
		en: [
			"§Web§        HTML5, CSS3, JavaScript, TypeScript",
			"§Strong§     React, NodeJs",
			"§React§      NextJs, React Router, Redux, Zustand, React Hook",
			"           Form, styled-components, Tailwind",
			"§Basics§     MongoDb, Vue, Svelte, Electron, C\\#, Python, PHP",
			"§Tools§      VSCode (Copilot, Claude), git, CircleCI, Jenkins,",
			"           Webpack, Jira, Confluence",
			"§Methods§    agile (kanban, scrum), pair programming, unit tests",
			"           (Jest, Jasmine)",
			"§Design§     Figma, Zeplin, GIMP",
			"§Language§   French native, English B1, technical and written",
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

/**
 * Colour separators as the shell consumes them. Must match flower-shell's
 * list, or computed lengths drift from displayed ones and borders shift.
 */
const MARKERS = ["§", "+", "`", "!", "$", "_", "#"]

/** a marker preceded by \ is displayed as-is, so it does not pair up */
const ESCAPE = "\\"

/** the escaped marker, set aside during the computation */
const HIDDEN = String.fromCharCode(0)

/** A clickable marker carries its command after a ~; only the label shows. */
const CLICKABLE = "#"

const label = (line: string) =>
	line.replace(new RegExp(`${CLICKABLE}([^${CLICKABLE}]*)${CLICKABLE}`, "g"), (
		_,
		inner: string
	) => inner.split("~")[0].trim())

/**
 * Displayed length: separators vanish at render time, so counting them
 * would shift the right border. They only count in pairs, and an escaped
 * marker counts as the one character left on screen.
 */
const visible = (line: string) => {
	// out of play before pairing, as the renderer does
	const escaped = label(
		MARKERS.reduce(
			(text, marker) => text.split(`${ESCAPE}${marker}`).join(HIDDEN),
			line
		)
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

/**
 * Neutralises separators in text that is not markup (ASCII art, rules, the
 * `#` of C sharp), which would otherwise pair up at a distance.
 */
const escape = (text: string) =>
	text.replace(
		new RegExp(`[${MARKERS.join("")}]`, "g"),
		char => `${ESCAPE}${char}`
	)

/**
 * Colours a text, taking escaped markers out of the colour: the shell
 * restores escapes with react-string-replace, which does not descend into
 * existing elements.
 */
const paint = (text: string, marker: string) =>
	`${marker}${text.replace(
		new RegExp(`[${MARKERS.join("")}]`, "g"),
		char => `${marker}${ESCAPE}${char}${marker}`
	)}${marker}`

/** room available between borders, margins included */
const INNER = WIDTH - 6

/** content line, bordered left and right */
const row = (line = "") =>
	`|  ${line}${" ".repeat(Math.max(0, INNER - visible(line)))}  |`

/**
 * Shifts a line to centre it in the page. `width` centres a whole block on
 * its longest line, so its lines do not each start from a different edge.
 */
const center = (line: string, width = visible(line)) =>
	" ".repeat(Math.max(0, Math.floor((INNER - width) / 2))) + line

/**
 * Closed box, diagonal corners:
 *
 *   ______
 *  /      \\
 *  |      |
 *  \\______/
 */
const box = (lines: string[]) => [
	`${escape("+")}${"-".repeat(WIDTH - 2)}${escape("+")}`,
	...lines,
	`${escape("+")}${"-".repeat(WIDTH - 2)}${escape("+")}`,
]

/** The big name, in two stacked blocks: in one piece it is 83 columns wide. */
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

/** the name block is centred as one piece, on its widest line */
const BANNER_WIDTH = Math.max(...BANNER.map(line => line.length))

/** greeting, under the identity */
const INTRO: Record<Lang, string[]> = {
	fr: [
		"Développeur front end depuis quinze ans, dont dix chez SeLoger,",
		"sur des interfaces complexes : moteurs de recherche, cartographie",
		"interactive, temps réel — avec un vrai souci de performance et de",
		"qualité de code.",
		"",
		"Je cherche une nouvelle mission en React / TypeScript, en",
		"Île-de-France.",
	],
	en: [
		"Front end developer for fifteen years, ten of them at SeLoger, on",
		"complex interfaces: search engines, interactive mapping, real",
		"time — with a real care for performance and code quality.",
		"",
		"Now looking for a new React / TypeScript position, around Paris.",
	],
}

const header = (lang: Lang) =>
	box([
		row(),
		...BANNER.map(line =>
			row(line ? center(escape(line), BANNER_WIDTH) : "")
		),
		row(),
		row(center(JOB[lang])),
		row(),
		row(center(`§${PLACE[lang]}§`)),
		row(center(`§${app.email}§`)),
		row(),
		row(center(`${CLICKABLE}${DOWNLOAD[lang]}~${CV_PDF_PATTERN}${CLICKABLE}`)),
		row(),
		...INTRO[lang].map(line => row(line)),
		row(),
	])

/**
 * Timeline: years in the centre column, jobs on the left, skills picked up
 * that year on the right. Years with no landmark in the CV carry a
 * plausible skill rather than a gap — to reorder.
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
	{ year: "2023", right: "Tailwind, Lokalise, Next" },
	{ year: "2024", right: "Claude" },
	{ year: "2025", right: "Copilot, Zustand, Figma" },
	{ year: "2026", right: "React 19, Next 16" },
]

/** width of one side of the timeline, year column aside */
const HALF = (INNER - 6) / 2

/** pushes a text against the year column */
const toCenter = (text: string) =>
	`${" ".repeat(Math.max(0, HALF - visible(text)))}${text}`

type Palier = { year: string; left: string; skills: string[] }

/**
 * Only years with a job get a line; the others pour their skills into the
 * step above, so the first TIMELINE entry must carry a job.
 */
const paliers = (lang: Lang): Palier[] =>
	TIMELINE.reduce<Palier[]>((acc, entry) => {
		if (entry.left)
			acc.push({ year: entry.year, left: entry.left[lang], skills: [] })

		const last = acc[acc.length - 1]
		if (entry.right && last) last.skills.push(entry.right)

		return acc
	}, [])

/** Skill hooked to the year column; only a step's first one draws a stroke. */
const skill = (name?: string, leader = "----") =>
	name ? `${leader} ${paint(name, "+")}` : ""

/** the empty year column, running from one step to the next */
const gap = () => row(`${toCenter("")}|    |`)

/** a step: job on the left, year in the centre, skills on the right */
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

/** steps breathe: the year column stays drawn between them */
const timeline = (lang: Lang) => [
	row(
		`${toCenter(`+${LEGEND[lang].left}+     `)}|    |     +${LEGEND[lang].right}+`
	),
	...paliers(lang).flatMap(palier => [gap(), ...step(palier)]),
]

/** the timeline is built, other sections are read as they are */
const body = (key: string, lang: Lang) =>
	key === "timeline" ? timeline(lang) : LINES[key][lang].map(line => row(line))

const section = (key: string, lang: Lang) =>
	box([
		row(`+${TITLES[key][lang]}+`),
		row(escape("_".repeat(INNER))),
		row(),
		...body(key, lang),
		row(),
	])

const RULER: Record<Lang, string> = {
	fr: "élargissez la fenêtre pour lire cette ligne d'un seul trait",
	en: "resize your window until this line fits on one row",
}

/** Width gauge: as wide as the page, so if it wraps, the rest of the CV will too. */
const ruler = (lang: Lang) => {
	const dashes = WIDTH - RULER[lang].length - 4
	const left = Math.floor(dashes / 2)

	return `<${"-".repeat(left)} ${RULER[lang]} ${"-".repeat(dashes - left)}>`
}

/** boxes follow each other, separated by a blank line */
const page = (keys: string[], lang: Lang) =>
	[[ruler(lang)], header(lang), ...keys.map(key => section(key, lang))]
		.map(lines => lines.join("\n"))
		.join("\n\n")

/** one section, or the whole CV when none is asked for */
export const buildCV = (section?: string): Translatable => {
	const keys = section ? [section] : FULL_SECTIONS

	return LANGS.reduce(
		(acc, lang) => ({ ...acc, [lang]: `\n${page(keys, lang)}\n` }),
		{}
	) as Translatable
}
