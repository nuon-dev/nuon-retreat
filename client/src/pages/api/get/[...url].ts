import { NextApiRequest, NextApiResponse } from "next"
import { SERVER_FULL_PATH, GET_HEADER } from "../index"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query
  const url = Array.isArray(req.query.url)
    ? req.query.url.join("/")
    : req.query.url || ""

  const queryString = Object.keys(query)
    .map((key) => {
      if (key === "url") {
        return ""
      }
      return `${key}=${query[key]}`
    })
    .join("&")

  const result = await fetch(`${SERVER_FULL_PATH}/${url}?${queryString}`, {
    method: "GET",
    headers: { ...GET_HEADER, ...req.headers },
  })
  if (result.status === 200) {
    res.status(result.status).json(await result.json())
  } else if (result.status === 401) {
    res.status(200).json({ error: "permission error." })
  } else {
    res.status(200).json({ error: await result.text() })
  }
}
