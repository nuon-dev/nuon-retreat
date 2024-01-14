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
      >
        <img src="/main_bg.webp" width="100%" />
      </Stack>
    </Stack>
  )
}

export default index
