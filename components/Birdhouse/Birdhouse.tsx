import * as S from "./UI"

const URL = "https://mathieujullien77190.github.io/birds/"

const BODY = "10,58 46,38 46,120 10,120"

/**
 * A birdhouse seen from the side, its back against the right edge of the
 * screen: a trapezoid wall of vertical boards, its top sloping down toward
 * the front, under a roof that follows the slope and overhangs the front.
 * White wall, oak roof.
 */
export const Birdhouse = () => (
	<S.Wrapper
		href={URL}
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Birds"
	>
		<svg viewBox="0 0 46 124" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<clipPath id="birdhouse-body">
					<polygon points={BODY} />
				</clipPath>
			</defs>
			{/* wall, then its vertical boards */}
			<polygon points={BODY} fill="#ffffff" />
			<g clipPath="url(#birdhouse-body)" stroke="#c4c4c4" strokeWidth="1.5">
				{[16, 22, 28, 34, 40].map(x => (
					<line key={x} x1={x} y1="38" x2={x} y2="120" />
				))}
			</g>
			<polygon
				points={BODY}
				fill="none"
				stroke="#8c8c8c"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			{/* roof: a slab following the slope, overhanging the front */}
			<polygon
				points="2,55 46,31 46,38 2,62"
				fill="#b8854a"
				stroke="#6b4423"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
		</svg>
	</S.Wrapper>
)
