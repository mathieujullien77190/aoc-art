import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: process.env.ANALYZE === "true",
})

const nextConfig = {
	agentRules: false,
	devIndicators: false,
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

export default withBundleAnalyzer(nextConfig)
