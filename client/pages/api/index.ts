const PORT = 8000
const SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.SERVER_URL
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

const COMMON_HEADER = {
  "token": '9bb8ecdea49ad4cd753292ae9eba67271d30c19ebe95b5f4a351291f4e38c5c18804992400f37a0ae285d1a532572c0c1078e108820531983989b17f1bd9d03e'
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