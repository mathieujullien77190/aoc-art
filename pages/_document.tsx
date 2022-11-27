/** @format */

import Document, {
	Head,
	Html,
	Main,
	NextScript,
	DocumentContext,
} from "next/document"
import { ServerStyleSheet } from "styled-components"

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet()
		const originalRenderPage = ctx.renderPage

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
				})

			const initialProps = await Document.getInitialProps(ctx)
			return {
				...initialProps,
				styles: [
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>,
				],
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		const isProd = process.env.NODE_ENV === "production"
		return (
			<Html lang="fr">
				<Head>
					<meta charSet="utf-8" />
					<link rel="shortcut icon" href="/favicon.ico"></link>
				</Head>

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
