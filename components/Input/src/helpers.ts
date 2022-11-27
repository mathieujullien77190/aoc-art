/** @format */

export const cleanCommand = (cmd: string) => {
	return cmd
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
}
