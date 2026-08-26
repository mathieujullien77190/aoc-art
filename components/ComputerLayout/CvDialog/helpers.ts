import { CV_PDF_URL } from "./constants"

/**
 * Google Docs renvoie l'export en piece jointe : l'onglet ouvert declenche
 * le telechargement puis se referme seul. Un attribut download ne servirait
 * a rien, il est ignore hors du meme domaine.
 */
export const downloadCv = () => window.open(CV_PDF_URL, "_blank", "noopener")
