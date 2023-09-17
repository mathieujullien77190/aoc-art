import { NextApiResponse } from "next"

export const createHTTPError = ({
	code,
	response,
}: {
	response: NextApiResponse
	code: string
}) => {
	return response.status(401).json({ code })
}

export const createHTTPSuccess = <T>({
	response,
	data,
}: {
	response: NextApiResponse
	data?: T
}) => {
	return response.status(200).json({ data })
}

export const extractSubKeys = (
	collectionName: string,
	keys: string[]
): string[] => keys.map(key => key.replace(`${collectionName}:`, ""))
