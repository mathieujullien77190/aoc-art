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

const rand = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min)

const heightFlower = 9
const flowers = [
	`       
       
 @@@@  
@@()@@ 
 @@@@  
  /    
\\ |    
\\\\|//  
^^^^^^^
`,
	`       
       
       
wWWWw  
(___)  
  Y    
\\ |/   
\\\\|/// 
^^^^^^^
`,
	`   _      
 _(_)_    
(_)@(_)   
  (_)\\    
     \`|/  
     \\|   
      | / 
   \\\\\\|// 
^^^^^^^^^^
`,
	`         
         
 vVVVv   
 (___)   
   Y     
  \\|/    
 \\ | /   
\\\\\\|///  
^^^^^^^^^
`,
	`           
   __/)    
.-(__(=:   
   | \\)    
 /||       
 \\||       
  \\|       
   |       
^^^^^^^^^^^
`,
]

export const plantFlowers = () => {
	const colorFlowers = ["R", "I", "B", "T", "J", "H", "X", "D", "Z"]
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)

	const baseArr = Array(colorFlowers.length).fill(null)
	const allFlowers = Array(heightFlower).fill(null)
	const flowersArr = baseArr
		.map(() => flowers[rand(0, flowers.length - 1)])
		.map(flower => flower.split("\n"))

	const compileFlowers = allFlowers
		.map((_, i) =>
			baseArr
				.map((_, j) =>
					!flowersArr[j][i].match(/[@\(_vw\)]/gi)
						? `${flowersArr[j][i]}`
						: `${colorFlowers[j]}${flowersArr[j][i]}${colorFlowers[j]}`
				)
				.join("")
		)
		.join("\n")

	return compileFlowers
}
