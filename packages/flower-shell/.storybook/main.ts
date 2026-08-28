import type { StorybookConfig } from "@storybook/react-vite"

/**
 * Le terminal se lance seul, sans le site autour. Les stories vivent dans
 * le paquet et n'importent que du relatif : rien a aliaser.
 */
const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
}

export default config
