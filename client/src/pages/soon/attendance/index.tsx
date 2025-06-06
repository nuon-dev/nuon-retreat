"use client"

import { Stack } from "@mui/material"
import { get } from "pages/api"
import { useEffect, useState } from "react"

export default function SoonAttendance() {
  const [groupName, setGroupName] = useState("")

  useEffect(() => {
    fetchGroupDate()
  }, [])

  async function fetchGroupDate() {
    await get("/mt-group-info")
  }
  return (
    <Stack>
      <Stack>{groupName}</Stack>
    </Stack>
  )
}
