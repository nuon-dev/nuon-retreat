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
  TextField,
} from "@mui/material"
import { useEffect, useState } from "react"
import { User } from "@server/entity/user"
import Header from "@/components/AdminHeader"
import { get, post, put, dele } from "@/config/api"

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
  
  // 필터 상태
  const [filterName, setFilterName] = useState("")
  const [filterGender, setFilterGender] = useState<"" | "man" | "woman">("")
  const [filterMinYear, setFilterMinYear] = useState("")
  const [filterMaxYear, setFilterMaxYear] = useState("")

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

  async function deleteUser() {
    if (selectedUser.id && confirm("정말로 삭제하시겠습니까?")) {
      await dele(`/admin/soon/delete-user/${selectedUser.id}`, {})
      clearSelectedUser()
      await fetchData()
    }
  }

  function clearFilters() {
    setFilterName("")
    setFilterGender("")
    setFilterMinYear("")
    setFilterMaxYear("")
  }

  function orderingUserList() {
    return userList
      .filter((user) => {
        // 기본 필터 (이름이 있는 사용자만)
        if (!user.name) return false
        
        // 이름 필터
        if (filterName && !user.name.toLowerCase().includes(filterName.toLowerCase())) {
          return false
        }
        
        // 성별 필터
        if (filterGender && user.gender !== filterGender) {
          return false
        }
        
        // 생년 범위 필터
        if (filterMinYear && user.yearOfBirth < parseInt(filterMinYear)) {
          return false
        }
        if (filterMaxYear && user.yearOfBirth > parseInt(filterMaxYear)) {
          return false
        }
        
        return true
      })
      .sort((a, b) => {
        if (orderProperty === "name") {
          if (direction === "asc") {
            return a.name.localeCompare(b.name)
          }
          return b.name.localeCompare(a.name)
        }
        if (orderProperty === "yearOfBirth") {
          if (direction === "asc") {
            return a.yearOfBirth - b.yearOfBirth
          }
          return b.yearOfBirth - a.yearOfBirth
        }
        if (orderProperty === "phone") {
          if (direction === "asc") {
            return a.phone.localeCompare(b.phone)
          }
          return b.phone.localeCompare(a.phone)
        }
        if (orderProperty === "gender") {
          if (direction === "asc") {
            return a.gender.localeCompare(b.gender)
          }
          return b.gender.localeCompare(a.gender)
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
          <Box p="8px" bgcolor="#f5f5f5" fontSize="14px">
            총 {orderingUserList().length}명 (전체 {userList.length}명)
          </Box>
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
          <Stack 
            p="16px" 
            m="12px" 
            border="1px solid #e0e0e0" 
            borderRadius="12px"
            bgcolor="#fafafa"
            boxShadow="0 2px 4px rgba(0,0,0,0.1)"
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb="16px">
              <Box fontWeight="bold" fontSize="16px" color="#333">필터</Box>
              <Button 
                size="small" 
                onClick={clearFilters}
                variant="outlined"
                sx={{ 
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "12px"
                }}
              >
                초기화
              </Button>
            </Stack>
            
            <Stack gap="12px">
              <Stack direction="row" alignItems="center" gap="12px">
                <Box width="60px" fontSize="14px">이름:</Box>
                <TextField
                  size="small" 
                  placeholder="이름 검색"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  variant="outlined"
                  sx={{ flex: 1 }}
                />
              </Stack>
              
              <Stack direction="row" alignItems="center" gap="12px">
                <Box width="60px" fontSize="14px">성별:</Box>
                <TextField
                  select
                  size="small"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as "" | "man" | "woman")}
                  variant="outlined"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value="man">남</MenuItem>
                  <MenuItem value="woman">여</MenuItem>
                </TextField>
              </Stack>
              
              <Stack direction="row" alignItems="center" gap="12px">
                <Box width="60px" fontSize="14px">생년:</Box>
                <TextField
                  size="small"
                  placeholder="최소"
                  value={filterMinYear}
                  onChange={(e) => setFilterMinYear(e.target.value)}
                  variant="outlined"
                  type="number"
                  sx={{ width: "90px" }}
                />
                <Box fontSize="12px" color="gray">~</Box>
                <TextField
                  size="small"
                  placeholder="최대"
                  value={filterMaxYear}
                  onChange={(e) => setFilterMaxYear(e.target.value)}
                  variant="outlined"
                  type="number"
                  sx={{ width: "90px" }}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack flex={1} gap="12px">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button 
                onClick={clearSelectedUser} 
                variant="outlined"
                sx={{ 
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 2
                }}
              >
                새로 입력
              </Button>
              <Box 
                fontSize="14px" 
                color="#666"
                fontWeight="500"
              >
                {selectedUser.id ? "정보 수정 중.." : "새로 입력 중.."}
              </Box>
              <Stack direction="row" gap="8px">
                {selectedUser.id && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={deleteUser}
                    sx={{ 
                      borderRadius: "8px",
                      textTransform: "none",
                      px: 2
                    }}
                  >
                    삭제
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  onClick={saveData}
                  sx={{ 
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 2,
                    bgcolor: "#1976d2",
                    "&:hover": {
                      bgcolor: "#1565c0"
                    }
                  }}
                >
                  저장
                </Button>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" gap="12px">
              <Box width="80px" textAlign="right">
                이름 :{" "}
              </Box>
              <TextField
                value={selectedUser.name}
                onChange={(e) => onChangeData("name", e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap="12px">
              <Box width="80px" textAlign="right">
                생년 :{" "}
              </Box>
              <TextField
                value={selectedUser.yearOfBirth}
                onChange={(e) => onChangeData("yearOfBirth", e.target.value)}
                variant="outlined"
                size="small"
                type="number"
                sx={{ flex: 1 }}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap="12px">
              <Box width="80px" textAlign="right">
                연락처 :{" "}
              </Box>
              <TextField
                value={selectedUser.phone}
                onChange={(e) => onChangeData("phone", e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>{" "}
            <Stack direction="row" alignItems="center" gap="12px">
              <Box width="80px" textAlign="right">
                성별 :
              </Box>
              <TextField
                select
                value={selectedUser.gender}
                onChange={(e) => onChangeData("gender", e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
              >
                <MenuItem value="man">남</MenuItem>
                <MenuItem value="woman">여</MenuItem>
              </TextField>
            </Stack>
            <Stack direction="row" alignItems="center" gap="12px">
              <Box width="80px" textAlign="right">
                기타 사항 :{" "}
              </Box>
              <TextField
                value={selectedUser.etc}
                onChange={(e) => onChangeData("etc", e.target.value)}
                variant="outlined"
                size="small"
                multiline
                rows={3}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
