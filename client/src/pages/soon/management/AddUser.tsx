"use client"

import {
  Button,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { post } from "pages/api"
import { useState } from "react"

interface AddUserProps {
  onClose: () => void
}

export default function AddUser({ onClose }: AddUserProps) {
  const [userName, setUserName] = useState("")
  const [yearOfBirth, setYearOfBirth] = useState("")
  const [gender, setGender] = useState("man")
  const [phone, setPhone] = useState("")

  async function handleSave() {
    if (!userName || !yearOfBirth || !gender || !phone) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    await post("/soon/add-user", {
      userName,
      yearOfBirth,
      gender,
      phone,
    })
    onClose()
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack bgcolor="white" borderRadius="24px" p="24px" gap="24px">
        <Stack>순원 추가</Stack>
        <Stack gap="12px">
          <Stack gap="12px" direction="row" alignItems="center">
            <Stack width="60px" textAlign="right">
              이름
            </Stack>
            <Stack>
              <TextField
                size="small"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Stack>
          </Stack>
          <Stack gap="12px" direction="row" alignItems="center">
            <Stack width="60px" textAlign="right">
              출생년도
            </Stack>
            <Stack>
              <TextField
                size="small"
                type="number"
                value={yearOfBirth}
                onChange={(e) => setYearOfBirth(e.target.value)}
              />
            </Stack>
          </Stack>
          <Stack gap="12px" direction="row" alignItems="center">
            <Stack width="80px" textAlign="right">
              성별
            </Stack>
            <Select
              fullWidth
              size="small"
              value={gender}
              onChange={(e) => setGender(e.target.value as string)}
            >
              <MenuItem value="man">남</MenuItem>
              <MenuItem value="woman">여</MenuItem>
            </Select>
          </Stack>
          <Stack gap="12px" direction="row" alignItems="center">
            <Stack width="60px" textAlign="right">
              전화번호
            </Stack>
            <Stack>
              <TextField
                size="small"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Stack>
          </Stack>
        </Stack>
        <Button variant="outlined" onClick={handleSave}>
          저장하기
        </Button>
      </Stack>
    </Modal>
  )
}
