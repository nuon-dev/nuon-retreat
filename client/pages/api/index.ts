const PORT = 8000
const SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.SERVER_URL
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

const COMMON_HEADER = {
  "token": 'a099dca661061fc7bbdac66f6e91b755eceb0731bbcb65656e83d6623ffb4c89425a5bb5775d2fa265e4590aaa48453aa286c811fb13bdf117e256587b81d7eb'
}

export const GET_HEADER = {
    ...COMMON_HEADER,
}

export const POST_HEADER = new Headers({
  ...COMMON_HEADER,
  "Content-Type": "application/json",
})

export async function post (path: string, data: any) {
  const header = new Headers();
  header.append("Content-Type", "application/json")

  const respone = await fetch(`/api/post${path}`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(data)
  })

  return await respone.json()
}

export async function get(path: string) {
  const respone = await fetch(`/api/get${path}`)
  return await respone.json()
}