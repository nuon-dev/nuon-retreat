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
  TableSortLabel,
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
  const [orderProperty, setOrderProperty] = useState<keyof User>("name")
  const [direction, setDirection] = useState<"asc" | "desc">("asc")

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

  function orderingUserList() {
    return userList
      .filter((user) => {
        return user.name
      })
      .sort((a, b) => {
        if (orderProperty === "name") {
          if (direction === "asc") {
            return b.name.localeCompare(a.name)
          }
          return a.name.localeCompare(b.name)
        }
        if (orderProperty === "yearOfBirth") {
          if (direction === "asc") {
            return b.yearOfBirth - a.yearOfBirth
          }
          return a.yearOfBirth - b.yearOfBirth
        }
        if (orderProperty === "phone") {
          if (direction === "asc") {
            return b.phone.localeCompare(a.phone)
          }
          return a.phone.localeCompare(b.phone)
        }
        if (orderProperty === "gender") {
          if (direction === "asc") {
            return b.gender.localeCompare(a.gender)
          }
          return a.gender.localeCompare(b.gender)
        }
        return 0
      })
  }

  function oncClickedSort(property: keyof User) {
    if (orderProperty === property) {
      setDirection(direction === "asc" ? "desc" : "asc")
    } else {
      setOrderProperty(property)
      setDirection("asc")
    }
  }

  return (
    <Stack minHeight="100vh">
      <Header />
      <Stack direction="row" p="12px" gap="12px">
        <Stack
          width="50%"
          flex={1}
          border="1px solid #ccc"
          maxHeight="calc(100vh - 84px)"
          overflow="auto"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderProperty === "name"}
                    direction={direction}
                    onClick={() => {
                      oncClickedSort("name")
                    }}
                  >
                    이름
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderProperty === "gender"}
                    direction={direction}
                    onClick={() => {
                      oncClickedSort("gender")
                    }}
                  >
                    성별
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderProperty === "yearOfBirth"}
                    direction={direction}
                    onClick={() => {
                      oncClickedSort("yearOfBirth")
                    }}
                  >
                    생년
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderProperty === "phone"}
                    direction={direction}
                    onClick={() => {
                      oncClickedSort("phone")
                    }}
                  >
                    전화번호
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderingUserList().map((user) => {
                return (
                  <TableRow
                    key={user.id}
                    onClick={() => {
                      setSelectedUsers(user)
                    }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.gender === "man" ? "남" : "여"}</TableCell>
                    <TableCell>{user.yearOfBirth}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Stack>
        <Stack width="50%">
          <Stack p="12px" m="12px" border="1px solid gray" borderRadius="12px">
            필터
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
                기타 사항 :{" "}
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
    </Stack>
  )
}
