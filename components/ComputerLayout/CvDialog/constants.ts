import { Translatable } from "_/types"

/** export PDF du document source, servi en piece jointe par Google Docs */
export const CV_PDF_URL =
	"https://docs.google.com/document/d/17a1TBnVzrtmUbMPjUmikmpQvH8X6h0xV/export?format=pdf"

export const TEXTS: Record<string, Translatable> = {
	intro: {
		fr: "Le CV de Mathieu JULLIEN.",
		en: "Mathieu JULLIEN's resume.",
	},
	ascii: { fr: "CV ASCII", en: "ASCII CV" },
	pdf: { fr: "CV PDF", en: "PDF CV" },
	confirm: {
		fr: "Êtes-vous sûr de vouloir le télécharger en PDF ? La version ASCII est quand même bien meilleure.",
		en: "Are you sure you want to download the PDF? The ASCII one is much better, honestly.",
	},
	yes: { fr: "Oui", en: "Yes" },
	no: { fr: "Non", en: "No" },
}
