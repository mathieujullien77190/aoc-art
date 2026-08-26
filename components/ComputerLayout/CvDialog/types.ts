export type CvDialogProps = {
	/** ouvre le terminal sur la commande cv */
	onAscii: () => void
	/** telecharge le PDF, avec ce que cela implique */
	onPdf: () => void
	onClose: () => void
}
