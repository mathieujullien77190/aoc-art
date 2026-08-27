/** @format */

import next from "eslint-config-next/core-web-vitals"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

const config = [
	{ ignores: [".next/**", "out/**", "node_modules/**"] },
	...next,
	...tseslint.configs.recommended,
	prettier,
]

export default config
