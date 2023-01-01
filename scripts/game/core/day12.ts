/** @format */

import { input } from "../data/day12"
import { extractTab2 } from "../helpers"
import { colors } from "_components/constants"

const color = (code, parent) => {
	;[...parent.querySelectorAll("div")].forEach(element => {
		const charCode = getCode(element)

		if (charCode === 123) element.style.background = colors.appColor
		else if (charCode === code + 1) element.style.background = colors.infoColor
		else if (charCode > code + 1)
			element.style.background = calcColorHight(charCode)
		else if (charCode < code) element.style.background = calcColorLow(charCode)
		else element.style.background = "white"
	})
}

const colorPass = positions => {
	positions.forEach((item, i, tab) => {
		if (i < tab.length - 1) {
			item.element.style.background = "red"
			item.element.style.color = "black"
		} else {
			//const rp = item.element.getBoundingClientRect()
			//const end = item.letter === "{" ? "END : " : ""
			item.element.style.background = "red"
			//nbHTML.style.top = `${rp.y - 60}px`
			//nbHTML.style.left = `${rp.x - 60}px`
			//nbHTML.innerText = `${end}${positions.length - 1}`
		}
	})
}

const calcColorLow = code => colors.importantColor

const calcColorHight = code => colors.overlay

const isOp = (currentCode, pos, listPass) => {
	const nextCode = getCodeAt(pos)
	return !!(
		nextCode !== 0 &&
		(currentCode === 83 ||
			nextCode <= currentCode ||
			nextCode === currentCode + 1) &&
		listPass.filter(item => item.pos.x === pos.x && item.pos.y === pos.y)
			.length === 0
	)
}

const getCode = element => {
	return element.dataset.item.charCodeAt()
}

const getCodeAt = pos => {
	const el = getElement(pos)
	return el ? getCode(el) : 0
}

const getElement = pos => document.body.querySelector(`#x${pos.x}y${pos.y}`)

const newPos = (e, pos) => {
	const { x, y } = pos
	if (e.key === "ArrowRight") return { x: x + 1, y }
	if (e.key === "ArrowLeft") return { x: x - 1, y }
	if (e.key === "ArrowUp") return { y: y - 1, x }
	if (e.key === "ArrowDown") return { y: y + 1, x }
}

const setCase = pos => {
	return {
		pos,
		element: getElement(pos),
		code: getCodeAt(pos),
	}
}

const handlerKeyUp = (e, current, listPass, parent) => {
	if (e.keyCode >= 37 && e.keyCode <= 40) {
		const POS = newPos(e, current.pos)
		const next = setCase(POS)

		if (isOp(current.code, POS, listPass)) {
			if (next.code !== current.code) {
				color(next.code, parent)
			}

			return [...listPass, next]
		}
	}
	return listPass
}

export const generateGame = () => {
	const data = extractTab2(input, "\n", "").map(line =>
		line.map(item => (item === "E" ? "{" : item === "S" ? "a" : item))
	)

	const tabHTML = data.map((line, y) =>
		line.map((item, x) => `<div id="x${x}y${y}" data-item="${item}"></div>`)
	)

	const strHTML = tabHTML.map(item => item.join("")).join("<br/>")

	return strHTML
}

export const init = (x, y, parent, cb) => {
	//const nbHTML = document.body.querySelector(`#nb`)

	let current = setCase({ x, y })
	let listPass = [current]

	color(current.code, parent)
	colorPass(listPass)

	document.body.addEventListener("keyup", e => {
		listPass = handlerKeyUp(e, listPass[listPass.length - 1], listPass, parent)
		cb(listPass)
		colorPass(listPass)
	})
}

// init(0, 20)
