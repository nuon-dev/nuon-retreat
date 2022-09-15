import { SERVER_FULL_PATH, GET_HEADER } from "../index";

export default async function handler(req, res) {
    const result = await fetch(`${SERVER_FULL_PATH}/${req.query.url}`, 
        {
            method: 'GET',
            headers: GET_HEADER
    })
    res.status(result.status).json(await result.json())
}
  