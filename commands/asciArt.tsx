import { CSSProperties } from "react"
import reactStringReplace from "react-string-replace"
import { colors } from "_components/constants"
import uniqid from "uniqid"

export const title = `
 ________   .---.       ,-----.    .--.      .--.    .-''-.  .-------.               .-'''-. .---.  .---.     .-''-.    .---.     .---.      
|        |  | I,_I|     .'  B.-,B  '.  |  |_     |  |  .'S_ _S   \\ |  J_ _J   \\             / Z_Z     \\|   |  |D_ _D|   .'T_ _T   \\   | H,_H|     | K,_K|      
|   .----'I,-./  )I    / B,-.|  \\ _B \\ | G_( )_G   |  | / S( \` )S   '| J( ' )J  |            Z(\`' )Z/\`--'|   |  D( ' )D  / T( \` )T   'H,-./  )H   K,-./  )K      
|  _|____ I\\  '_ '\`)I ;  B\\  '_ /  |B :|G(_ o _)G  |  |. S(_ o _)S  ||J(_ o _)J /           Z(_ o _)Z.   |   '-D(_{;}_)D. T(_ o _)T  |H\\  '_ '\`)H K\\  '_ '\`)K    
|R_( )_R   | I> (_)  )I |  B_\`,/ \\ _/B  || G(_,_)G \\ |  ||  S(_,_)S___|| J(_,_)J.' __          Z(_,_)Z. '. |      D(_,_)D |  T(_,_)T___| H> (_)  )H  K> (_)  )K    
R(_ o._)R__|I(  .  .-'I : B(  '\\_/ \\B   ;|  |/    \\|  |'  \\   .---.|  |\\ \\  |  |        .---.  \\  :| J_ _J--.   | '  \\   .---.H(  .  .-'H K(  .  .-'K    
|R(_,_)R     I\`-'\`-'I|___\\ B\`"/  \\  )B / |  '  /\\  \`  | \\  \`-'    /|  | \\ \`'   /        \\    \`-'  ||J( ' )J |   |  \\  \`-'    / H\`-'\`-'H|___K\`-'\`-'K|___  
|   |       |        \\'. B\\_/\`\`"B.'  |    /  \\    |  \\       / |  |  \\    /          \\       / J(_{;}_)J|   |   \\       /   |        \\|        \\ 
'---'       \`--------\`  '-----'    \`---'    \`---\`   \`'-..-'  ''-'   \`'-'            \`-...-'  'J(_,_)J '---'    \`'-..-'    \`--------\`\`--------\` 
`

export const highlightFlower = (text: any, baseStyles: CSSProperties) => {
	let result = text

	const list = [
		{ reg: /R(.*)R/g, styles: { color: colors.restrictedColor } },
		{ reg: /S(.*)S/g, styles: { color: colors.restrictedColor } },
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
		result = reactStringReplace(result, item.reg, match => (
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
