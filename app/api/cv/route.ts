import { NextResponse } from "next/server"

import { CV_LANGS, CvLang, cvJson } from "_commands/cvData"

/** /api/cv/?lang=en, French by default; ?download to save it as a file */
export const GET = (request: Request) => {
	const { searchParams } = new URL(request.url)
	const asked = searchParams.get("lang") as CvLang

	if (asked && !CV_LANGS.includes(asked))
		return NextResponse.json(
			{ error: `lang must be one of: ${CV_LANGS.join(", ")}` },
			{ status: 400 }
		)

	const lang = asked ?? "fr"
	const headers: Record<string, string> = {}

	if (searchParams.has("download"))
		headers["Content-Disposition"] = `attachment; filename="cv-${lang}.json"`

	return NextResponse.json(cvJson(lang), { headers })
}
