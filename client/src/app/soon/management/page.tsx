"use client"

import { Button, Stack } from "@mui/material"
import { Community } from "@server/entity/community"
import { User } from "@server/entity/user"
import { get } from "config/api"
import { useEffect, useState } from "react"
import AddUser from "./AddUser"
import Header from "@components/Header/index"

export default function SoonManagement() {
  const [groupName, setGroupName] = useState("")
  const [soonList, setSoonList] = useState<User[]>([])
  const [openAddUser, setOpenAddUser] = useState(false)

  useEffect(() => {
    fetchGroupDate()
  }, [])

  async function fetchGroupDate() {
    const group: Community = await get("/soon/my-group-info")
    setGroupName(group.name)
    setSoonList(group.users)
  }

  function addUser() {}

  return (
    <Stack>
      <Header />
      <Stack p="12px" gap="12px">
        <Stack>{groupName} 다락방</Stack>
        <Button variant="outlined" onClick={() => setOpenAddUser(true)}>
          순원 추가
        </Button>
        <Stack gap="6px">
          {soonList.map((user) => (
            <Stack key={user.id}>
              {user.name} ({user.gender === "man" ? "남" : "여"}) (
              {user.yearOfBirth}) [{user.phone}]{" "}
              {user.kakaoId ? "로그인" : "등록"}
            </Stack>
          ))}
        </Stack>
        {openAddUser && (
          <AddUser
            onClose={() => {
              setOpenAddUser(false)
              fetchGroupDate()
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}
