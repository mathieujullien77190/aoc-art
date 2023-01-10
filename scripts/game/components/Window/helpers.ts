/** @format */

export const getWindowSize = (): { width: number; height: number } => {
	const w = document.body.querySelector(".window")
	const styles = getComputedStyle(w)
	const { width, height } = w.getBoundingClientRect()
	return {
		width: width - parseInt(styles.padding, 10) / 2,
		height: height - parseInt(styles.padding, 10),
	}
}
