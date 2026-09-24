import { app } from "_components/constants"

/**
 * The CV as data, for the API. The shell's own version lives in `cv.ts` as
 * ASCII boxes: keep the two in step when the content changes.
 */
export type CvLang = "fr" | "en"

export const CV_LANGS: CvLang[] = ["fr", "en"]

type Translated = Record<CvLang, string>

type Project = {
	name: Translated
	/** free text, as in the shell: "2021 – 2026", "2023"... */
	period?: string
	description: Translated
}

type Job = {
	company: string
	place: string
	from: string
	to: string
	projects: Project[]
}

type Skill = { category: Translated; items: string[] }

type Degree = { year: string; label: Translated }

const JOB: Translated = {
	fr: "Développeur JavaScript front end",
	en: "Front end JavaScript developer",
}

const PLACE: Translated = {
	fr: "Dammarie-les-Lys (77) · Île-de-France · permis B",
	en: "Dammarie-les-Lys (77) · Paris area · driving licence",
}

const SUMMARY: Translated = {
	fr: "Développeur front end depuis quinze ans, dont dix chez SeLoger, sur des interfaces complexes : moteurs de recherche, cartographie interactive, temps réel — avec un vrai souci de performance et de qualité de code. Je cherche une nouvelle mission en React / TypeScript, en Île-de-France.",
	en: "Front end developer for fifteen years, ten of them at SeLoger, on complex interfaces: search engines, interactive mapping, real time — with a real care for performance and code quality. Now looking for a new React / TypeScript position, around Paris.",
}

const EXPERIENCE: Job[] = [
	{
		company: "SeLoger",
		place: "Paris",
		from: "2016-09",
		to: "2026-04",
		projects: [
			{
				name: { fr: "Dépôt d'annonce", en: "Listing submission" },
				period: "2021 – 2026",
				description: {
					fr: "Formulaire multipage (Typeform, React Router), gestion des annonces et des candidatures, suivi des prospects en liste, en comparaison et en kanban (drag and drop, skeletons). Multilingue via Lokalise, déployé pour SeLoger France et Immowelt Allemagne.",
					en: "Multi-page form (Typeform, React Router), listing and application management, applicant tracking as a list, a side-by-side comparison and a kanban board (drag and drop, skeletons). Localised with Lokalise, shipped for SeLoger in France and Immowelt in Germany.",
				},
			},
			{
				name: { fr: "Vérification d'identité", en: "Identity verification" },
				period: "2023",
				description: {
					fr: "Parcours KYC complet en Next, upload et contrôle des pièces, reconnaissance faciale par un service tiers, reprise du parcours entre desktop et mobile.",
					en: "Full KYC journey built in Next, document upload and checks, third party face recognition, resuming the flow across desktop and mobile.",
				},
			},
			{
				name: { fr: "Carto Search", en: "Carto Search" },
				period: "2018 – 2021",
				description: {
					fr: "Bing Maps vers MapBox, Redux / RxJs / Turf, recherche isochrone, données temps réel en WebSocket.",
					en: "Bing Maps to MapBox, Redux / RxJs / Turf, isochrone search, live data over WebSocket.",
				},
			},
			{
				name: {
					fr: "Moteur de recherche et pages de résultats",
					en: "Search engine and result pages",
				},
				period: "2016 – 2018",
				description: {
					fr: "Refonte du composant historique en React / TypeScript, Redux, React Hook Form, styled-components — Vue et Svelte sur quelques briques. Tracking, publicité, lazy loading, CI CircleCI, tests Jest.",
					en: "Rewrote the legacy component in React / TypeScript, Redux, React Hook Form and styled-components — Vue and Svelte on a few parts. Tracking, ads, lazy loading, CircleCI, Jest tests.",
				},
			},
		],
	},
	{
		company: "Numericable",
		place: "Paris",
		from: "2014-04",
		to: "2016-07",
		projects: [
			{
				name: { fr: "VIZIR, SIG du réseau fibre", en: "VIZIR, fibre network GIS" },
				description: {
					fr: "Application C# / Oracle, auth LDAP, modules de recherche et d'édition en ArcGIS js / Dojo. Librairie carto ArcGIS réutilisable par les applis internes (tests Jasmine, builds Grunt, documentation générée). Web services SOAP : requêtes géographiques, réponses aux DICT.",
					en: "C# / Oracle app, LDAP auth, search and editing modules built on ArcGIS js / Dojo. Reusable ArcGIS mapping library for internal apps (Jasmine tests, Grunt builds, generated documentation). SOAP web services: geographic queries and DICT answers.",
				},
			},
		],
	},
	{
		company: "Michelin Travel Partner",
		place: "Paris",
		from: "2011-02",
		to: "2014-04",
		projects: [
			{
				name: {
					fr: "Widgets de guidage embarqués",
					en: "In-car navigation widgets",
				},
				description: {
					fr: "Automobile PSA (JS / HTML5, iPad, Android, SMEG), feuille de route embarquée, tests véhicule. Guide Vert, Guide Michelin, Trafic.",
					en: "PSA vehicles (JS / HTML5, iPad, Android, SMEG), embedded roadbook, on-vehicle test campaigns. Guide Vert, Guide Michelin, Traffic.",
				},
			},
			{
				name: { fr: "B2C", en: "B2C" },
				description: {
					fr: "Refonte de la page hôtel Viamichelin.",
					en: "Rebuilt the Viamichelin hotel page.",
				},
			},
			{
				name: { fr: "APIJs", en: "APIJs" },
				description: {
					fr: "Modules du framework maison, complétion multi-sources.",
					en: "Modules for the in-house framework, autocompletion.",
				},
			},
		],
	},
]

const SKILLS: Skill[] = [
	{
		category: { fr: "Web", en: "Web" },
		items: ["HTML5", "CSS3", "JavaScript", "TypeScript"],
	},
	{
		category: { fr: "Maîtrise", en: "Strong" },
		items: ["React", "NodeJs"],
	},
	{
		category: { fr: "React", en: "React" },
		items: [
			"NextJs",
			"React Router",
			"Redux",
			"Zustand",
			"React Hook Form",
			"styled-components",
			"Tailwind",
		],
	},
	{
		category: { fr: "Notions", en: "Basics" },
		items: ["MongoDb", "Vue", "Svelte", "Electron", "C#", "Python", "PHP"],
	},
	{
		category: { fr: "Outils", en: "Tools" },
		items: [
			"VSCode (Copilot, Claude)",
			"git",
			"CircleCI",
			"Jenkins",
			"Webpack",
			"Jira",
			"Confluence",
		],
	},
	{
		category: { fr: "Méthodes", en: "Methods" },
		items: [
			"agile (kanban, scrum)",
			"pair programming",
			"unit tests (Jest, Jasmine)",
		],
	},
	{
		category: { fr: "Design", en: "Design" },
		items: ["Figma", "Zeplin", "GIMP"],
	},
]

const LANGUAGES: Translated[] = [
	{ fr: "anglais B1, technique et écrit", en: "English B1, technical and written" },
]

const EDUCATION: Degree[] = [
	{
		year: "2010",
		label: {
			fr: "Master MIAGE option SIR — université d'Orléans",
			en: "MIAGE master's degree, SIR track — university of Orléans",
		},
	},
	{
		year: "2007",
		label: {
			fr: "DUT informatique — IUT Claude Bernard, Lyon 1",
			en: "Computer science degree — IUT Claude Bernard, Lyon 1",
		},
	},
	{
		year: "2005",
		label: {
			fr: "Baccalauréat scientifique, spécialité mathématiques",
			en: "Science baccalaureate, mathematics major",
		},
	},
]

const INTERESTS: Translated[] = [
	{ fr: "Menuiserie", en: "Woodworking" },
	{ fr: "Ornithologie", en: "Birdwatching" },
]

/** the CV in one language, as the API serves it */
export const cvJson = (lang: CvLang) => ({
	lang,
	name: app.author,
	alias: app.alias,
	title: JOB[lang],
	location: PLACE[lang],
	email: app.email,
	summary: SUMMARY[lang],
	experience: EXPERIENCE.map(job => ({
		...job,
		projects: job.projects.map(project => ({
			name: project.name[lang],
			period: project.period,
			description: project.description[lang],
		})),
	})),
	skills: SKILLS.map(skill => ({
		category: skill.category[lang],
		items: skill.items,
	})),
	languages: LANGUAGES.map(language => language[lang]),
	education: EDUCATION.map(degree => ({
		year: degree.year,
		label: degree.label[lang],
	})),
	interests: INTERESTS.map(interest => interest[lang]),
})
