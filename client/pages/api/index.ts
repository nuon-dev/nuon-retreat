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

export  async function post (path: string, data: any) {
  const header = new Headers();
  header.append("Content-Type", "application/json")

  const respone = await fetch(`/api/post${path}`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(data)
  })

  return await respone.json()
}