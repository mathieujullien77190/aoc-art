/** @format */

import next from "eslint-config-next/core-web-vitals"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

export default [
	{ ignores: [".next/**", "out/**", "node_modules/**"] },
	...next,
	...tseslint.configs.recommended,
	prettier,
]
