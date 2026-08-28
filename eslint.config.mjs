/** @format */

import next from "eslint-config-next/core-web-vitals"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

const config = [
	// code tiers ou genere : vendorise sous public, sorti par storybook
	{
		ignores: [
			".next/**",
			"out/**",
			"node_modules/**",
			"public/vendor/**",
			"packages/*/storybook-static/**",
		],
	},
	...next,
	...tseslint.configs.recommended,
	prettier,
]

export default config
