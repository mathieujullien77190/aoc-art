/** @format */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: process.env.ANALYZE === "true",
})

const nextConfig = {
	output: "export",
	trailingSlash: true,
	compiler: {
		styledComponents: {
			displayName: true,
			ssr: true,
			fileName: false,
		},
	},
}

module.exports = withBundleAnalyzer(nextConfig)
