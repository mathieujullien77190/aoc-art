/** @format */

require("dotenv").config()
const path = require("path")
const withPlugins = require("next-compose-plugins")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: process.env.ANALYZE === "true",
})

const nextConfig = {
	trailingSlash: true,
	exportPathMap: function () {
		return {
			"/": { page: "/" },
		}
	},
	webpack: (config, _options) => {
		config.resolve.alias = {
			...config.resolve.alias,
			_: path.join(__dirname),
			_components: path.join(__dirname, "components"),
			_commands: path.join(__dirname, "commands"),
			_pages: path.join(__dirname, "pages"),
			_contexts: path.join(__dirname, "contexts"),
			_hooks: path.join(__dirname, "hooks"),
			_store: path.join(__dirname, "store"),
			_constants: path.join(__dirname, "constants"),
			_public: path.join(__dirname, "public"),
		}
		config.resolve.extensions.push(...[".ts", ".tsx"])
		return config
	},
}

module.exports = withPlugins([withBundleAnalyzer], nextConfig)
