"use client"

import {
  Box,
  Button,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material"
import { useEffect, useState } from "react"
import { User } from "@server/entity/user"
import Header from "components/AdminHeader"
import { get } from "pages/api"

const emptyUser = {
  id: 0,
  name: "",
  age: 0,
  phone: "",
  village: "",
  darak: "",
  sex: "man",
  etc: "",
} as User

export default function Soon() {
  const [userList, setUserList] = useState<User[]>([])
  const [selectedUser, setSelectedUsers] = useState<User>(emptyUser)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const data = await get("/admin/get-all-user")
    setUserList(data)
  }

  function clearSelectedUser() {
    setSelectedUsers(emptyUser)
  }

  return (
    <Stack minHeight="100vh">
      <Header />
      <Stack direction="row" p="12px" gap="12px">
        <Stack flex={1} border="1px solid #ccc">
          <Table>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>생년</TableCell>
              <TableCell>전화번호</TableCell>
            </TableRow>
            <TableBody>
              {userList.map((user) => {
                return (
                  <TableRow onClick={() => setSelectedUsers(user)}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Stack>
        <Stack flex={1} gap="12px">
          <Stack direction="row" justifyContent="space-between">
            <Button onClick={clearSelectedUser} variant="outlined">
              새로 입력
            </Button>
            <Box>{selectedUser.id ? "정보 수정 중.." : "새로 입력 중.."}</Box>
            <Button variant="outlined">저장</Button>
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>이름 : </Box>
            <Input value={selectedUser.name} />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>생년 : </Box>
            <Input value={selectedUser.age} />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>연락처 : </Box>
            <Input value={selectedUser.phone} />
          </Stack>{" "}
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>성별 : </Box>
            <Input value={selectedUser.sex} />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>기타사항 : </Box>
            <Input value={selectedUser.etc} />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>마을 : </Box>
            <Input disabled value={selectedUser.village} />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box>다락방 : </Box>
            <Input disabled value={selectedUser.darak} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
