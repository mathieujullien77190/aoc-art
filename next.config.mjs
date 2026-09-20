import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: process.env.ANALYZE === "true",
})

const nextConfig = {
	agentRules: false,
	devIndicators: false,
	output: "export",
	/**
	 * flower-shell's CJS build breaks styled-components interop: it wraps a
	 * module that already exposes its default, and styled.input disappears.
	 * Bundling the package takes its ESM build, which is fine.
	 */
	transpilePackages: ["flower-shell"],
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
