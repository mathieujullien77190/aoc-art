import styled from "styled-components"

export const Container = styled.div<{ $isOpen: boolean }>`
	cursor: pointer;
	height: 90px;
	width: 90px;
	margin: 5px;

	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;

	${({ $isOpen }) => {
		if ($isOpen)
			return `
      background-color:#004eff33;
      border: solid 1px #00096f;
      border-radius: 4px;
    `
	}}
`

export const Image = styled.div`
	height: 40px;
	width: 40px;
	font-size: 30px;
`

export const Name = styled.div`
	text-align: center;
	padding: 2px 0;
`
