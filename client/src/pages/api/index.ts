const PORT = 8000
const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "http://iubns.net"
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

const COMMON_HEADER = {}

export const GET_HEADER = new Headers({
  ...COMMON_HEADER,
})

export const POST_HEADER = new Headers({
  ...COMMON_HEADER,
  "Content-Type": "application/json",
})

export async function post(path: string, data: any) {
  const header = new Headers()
  const token = localStorage.getItem("token") || ""
  header.append("Content-Type", "application/json")
  header.append("token", token)

  const response = await fetch(`${SERVER_FULL_PATH}${path}`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(data),
  })

  return await response.json()
}

export async function get(path: string) {
  const token = localStorage.getItem("token") || ""
  const response = await fetch(`${SERVER_FULL_PATH}${path}`, {
    headers: new Headers({
      token,
    }),
  })
  return await response.json()
}
