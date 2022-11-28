/** @format */
import { Fragment } from "react"

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
					<Fragment key="someKey">
						{initialProps.styles}
						{sheet.getStyleElement()}
					</Fragment>,
				],
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
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
