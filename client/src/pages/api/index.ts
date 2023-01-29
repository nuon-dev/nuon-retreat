const PORT = 8000
const SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.SERVER_URL
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

const COMMON_HEADER = {
  
}

export const GET_HEADER = new Headers({
    ...COMMON_HEADER,
})

export const POST_HEADER = new Headers({
  ...COMMON_HEADER,
  "Content-Type": "application/json",
})

export async function post (path: string, data: any) {
  const header = new Headers();
  const token = localStorage.getItem('token') || ''
  header.append("Content-Type", "application/json")
  header.append("token", token)

  const respone = await fetch(`/api/post${path}`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(data)
  })

  return await respone.json()
}

export async function get(path: string) {
  const token = localStorage.getItem('token') || ''
  const respone = await fetch(`/api/get${path}`,
  {
    headers: new Headers({
      token,
    })
  })
  return await respone.json()
}