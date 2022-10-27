const PORT = 8000
const SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.SERVER_URL
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

const COMMON_HEADER = {
  "token": '06cc8af1a8a85b5f8cb974aae2fee4c41a3f9ef02d859a69344a441397c3552e3c788dd89ba9449258a96cd022b8d0a3e159d8d403607c8ad3d997bb454440d2'
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