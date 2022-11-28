/** @format */
import { CSSProperties } from "react"
import reactStringReplace from "react-string-replace"
import { colors } from "_components/constants"
import uniqid from "uniqid"

export const title = `
   ____        ,-----.        _______               .\`\`\`\`\`-.   .-\`\`\`\`\`\`\`-.     .\`\`\`\`\`-.      .\`\`\`\`\`-.   
 .'  __ \`.   .'  I.-,I  '.     /   __  \\             /   ,-.  \\ / ,\`\`\`\`\`\`\`. \\   /   ,-.  \\    /   ,-.  \\  
/   '  \\  \\ / I,-.|  \\ _I \\   | B,_B/  \\__)           (___/  |   ||/ K.-./ )K  \\|  (___/  |   |  (___/  |   | 
|___|  /  |;  I\\  '_ /  |I :B,-./  )B                       .'  / || K\\ '_ .')K||        .'  /         .'  /  
  _.-\`    ||  I_\`,/ \\ _/I  |B\\  '_ '\`)B                 _.-'_.-'  ||K(_ (_) _)K||    _.-'_.-'      _.-'_.-'   
.'   R_R    |: I(  '\\_/ \\I   ; B> (_)  )B  __           G_/_G  .'     ||  K/ .  \\K ||  H_/_H  .'       D_/_D  .'      
|  R_( )_R  | \\ I\`"/  \\  )I / B(  .  .-'B_/  )         G( ' )G(__..--.||  K\`-'\`"\`K || H( ' )H(__..--. D( ' )D(__..--. 
\\ R(_ o _)R /  '. I\\_/\`\`"I.'   B\`-'\`-'B     /         G(_{;}_)G      |\\'._______.'/H(_{;}_)H      |D(_{;}_)D      | 
 '.R(_,_)R.'     '-----'       \`._____.'           G(_,_)G-------' '._______.'  H(_,_)H-------' D(_,_)D-------'
`

export const highlightFlower = (text: any, baseStyles: CSSProperties) => {
	let result = text

	const list = [
		{ reg: /R(.*)R/g, styles: { color: colors.restrictedColor } },
		{ reg: /I(.*)I/g, styles: { color: colors.importantColor } },
		{ reg: /B(.*)B/g, styles: { color: colors.infoColor } },
		{ reg: /G(.*)G/g, styles: { color: colors.appColor } },
		{ reg: /T(.*)T/g, styles: { color: colors.restrictedColor } },
		{ reg: /J(.*)J/g, styles: { color: colors.importantColor } },
		{ reg: /H(.*)H/g, styles: { color: colors.appColor } },
		{ reg: /K(.*)K/g, styles: { color: colors.restrictedColor } },
		{ reg: /X(.*)X/g, styles: { color: colors.restrictedColor } },
		{ reg: /D(.*)D/g, styles: { color: colors.appColor } },
		{ reg: /Z(.*)Z/g, styles: { color: colors.infoColor } },
	]

	list.forEach(item => {
		result = reactStringReplace(result, item.reg, (match, i) => (
			<span
				key={uniqid()}
				style={{
					...item.styles,
					...baseStyles,
				}}
			>
				{match}
			</span>
		))
	})

	return result
}
