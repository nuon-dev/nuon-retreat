import { Box, Button, Stack } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect } from "react"

function index() {
  const { push } = useRouter()

  return (
    <Stack
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Stack
        onClick={() => {
          push("/info")
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: "url(/main_bg.jpg)",
          backgroundSize: "cover",
          alignItems: "center",
          backgroundRepeat: "round",
        }}
      ></Stack>
    </Stack>
  )
}

export default index
