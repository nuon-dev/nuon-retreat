import axios from "axios"

const isBrowser = typeof window !== "undefined"

const PORT = 8000
const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://nuon.iubns.net"
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

axios.defaults.baseURL = SERVER_FULL_PATH
if (isBrowser) {
  axios.defaults.headers.common["token"] = localStorage.getItem("token") || ""
}

export default axios
