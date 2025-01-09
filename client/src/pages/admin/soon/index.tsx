"use client"

import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { useEffect, useState } from "react"
import { User } from "@server/entity/user"
import Header from "components/AdminHeader"
import { get, post, put } from "pages/api"

const emptyUser = {
  id: 0,
  name: "",
  yearOfBirth: 0,
  phone: "",
  gender: "man",
  etc: "",
} as User

export default function Soon() {
  const [userList, setUserList] = useState<User[]>([])
  const [selectedUser, setSelectedUsers] = useState<User>(emptyUser)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const data = await get("/admin/soon/get-all-user")
    setUserList(data)
  }

  function clearSelectedUser() {
    setSelectedUsers(emptyUser)
  }

  function onChangeData(key: string, value: string) {
    setSelectedUsers({ ...selectedUser, [key]: value })
  }

  async function saveData() {
    if (selectedUser.id) {
      await put("/admin/soon/update-user", selectedUser)
    } else {
      await post("/admin/soon/insert-user", selectedUser)
    }
    await fetchData()
  }

  return (
    <Stack minHeight="100vh">
      <Header />
      <Stack direction="row" p="12px" gap="12px">
        <Stack flex={1} border="1px solid #ccc">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>생년</TableCell>
                <TableCell>전화번호</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => {
                return (
                  <TableRow
                    key={user.id}
                    onClick={() => {
                      setSelectedUsers(user)
                    }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.yearOfBirth}</TableCell>
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
            <Button variant="outlined" onClick={saveData}>
              저장
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              이름 :{" "}
            </Box>
            <Input
              value={selectedUser.name}
              onChange={(e) => onChangeData("name", e.target.value)}
            />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              생년 :{" "}
            </Box>
            <Input
              value={selectedUser.yearOfBirth}
              onChange={(e) => onChangeData("yearOfBirth", e.target.value)}
            />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              연락처 :{" "}
            </Box>
            <Input
              value={selectedUser.phone}
              onChange={(e) => onChangeData("phone", e.target.value)}
            />
          </Stack>{" "}
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              성별 :
            </Box>
            <Select
              autoWidth
              value={selectedUser.gender}
              onChange={(e) => onChangeData("gender", e.target.value)}
            >
              <MenuItem value="man">남</MenuItem>
              <MenuItem value="woman">여</MenuItem>
            </Select>
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              기타사항 :{" "}
            </Box>
            <Input
              value={selectedUser.etc}
              onChange={(e) => onChangeData("etc", e.target.value)}
            />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              마을 :{" "}
            </Box>
            <Input disabled value={""} />
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <Box width="80px" textAlign="right">
              다락방 :{" "}
            </Box>
            <Input disabled value={""} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
