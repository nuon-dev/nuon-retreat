import axios from "axios"

const PORT = 8000
const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://nuon.iubns.net"
export const SERVER_FULL_PATH = `${SERVER_URL}:${PORT}`

axios.defaults.baseURL = SERVER_FULL_PATH
axios.defaults.headers.common["token"] = localStorage.getItem("token") || ""

export default axios
