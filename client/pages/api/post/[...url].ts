import { SERVER_FULL_PATH, POST_HEADER } from "../index";

export default async function handler(req, res) {
    const result = await fetch(`${SERVER_FULL_PATH}/${req.query.url.join('/')}`,
        {
            method: 'POST',
            headers: {...POST_HEADER, ...req.headers},
            body: JSON.stringify(req.body)
    })
    res.status(result.status).json(await result.json())
}
  