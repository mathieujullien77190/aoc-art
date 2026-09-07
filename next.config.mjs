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
	 * Le build CJS de flower-shell casse a l'interop styled-components : il
	 * enveloppe un module qui expose deja son default, et styled.input
	 * disparait. Bundler le paquet fait prendre son build ESM, qui est bon.
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
