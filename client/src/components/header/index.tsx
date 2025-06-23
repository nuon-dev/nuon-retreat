"use client"

import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material"
import { useEffect, useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import { useRouter } from "next/navigation"

import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined"
import useUserData from "hooks/useUserData"
import { User } from "@server/entity/user"

export default function Header() {
  const { push } = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined) // Assuming User type is defined somewhere
  const { getUserDataFromToken } = useUserData()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const myRole = await getUserDataFromToken()
    if (!myRole) {
      return
    }
    setUserInfo(myRole)
  }

  function toggleDrawer(value: boolean) {
    setOpen(value)
  }

  function goToSoonManage() {
    push("/soon/management")
  }

  function goToSoonAttendance() {
    push("/soon/attendance")
  }

  function goToPostcard() {
    push("/soon/postcard")
  }

  function goToHome() {
    push("/")
  }

  function UserInfo() {
    if (!userInfo) {
      return null
    }
    return (
      <Stack>
        <Stack p="24px">
          {userInfo.name} ({userInfo.yearOfBirth})
        </Stack>
        <Divider />
      </Stack>
    )
  }

  return (
    <Stack
      width="100%"
      padding="8px"
      direction="row"
      bgcolor="#42C7F1"
      alignItems="center"
      justifyContent="space-between"
    >
      <Button onClick={goToHome}>
        <img width="80px" src="/logo_white.png" />
      </Button>
      <Button onClick={() => toggleDrawer(true)}>
        <MenuIcon
          color="action"
          style={{
            width: "40px",
            height: "36px",
          }}
        />
      </Button>
      <Drawer open={isOpen} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
        >
          <UserInfo />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={goToSoonManage}>
                <ListItemIcon>
                  <PermIdentityOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"순원 관리"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToSoonAttendance}>
                <ListItemIcon>
                  <PermIdentityOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"출석 관리"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToPostcard}>
                <ListItemIcon>
                  <PermIdentityOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"수련회 편지 작성"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Stack>
  )
}
