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
import { useRouter } from "next/router"

import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined"
import useUserData from "hooks/useUserData"

export default function Header() {
  const { getUserDataFromToken } = useUserData()
  const { push } = useRouter()
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const myRole = await getUserDataFromToken()
    if (!myRole) {
      return
    }
  }

  function toggleDrawer(value: boolean) {
    setOpen(value)
  }

  function goToEditMyData() {
    push("/remove/user/me")
  }

  function goToHome() {
    push("/")
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
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={goToEditMyData}>
                <ListItemIcon>
                  <PermIdentityOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"출석 관리"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Stack>
  )
}
