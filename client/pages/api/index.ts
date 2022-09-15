/*
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
*/

import exp from "constants"


const PORT = 8000
const SERVER_URL = 'http://localhost'
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`


const COMMON_HEADER = {

}

export const GET_HEADER = {
    ...COMMON_HEADER,
}

export const POST_HEADER = new Headers({
  ...COMMON_HEADER,
  "Content-Type": "application/json",
})