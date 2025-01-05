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
  MenuItem,
  MenuList,
  Paper,
  Stack,
} from "@mui/material"
import { useEffect, useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import { useRouter } from "next/router"

import GroupsIcon from "@mui/icons-material/Groups"
import ApartmentIcon from "@mui/icons-material/Apartment"
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined"
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined"
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined"
import useUserData from "hooks/useUserData"

export default function Header() {
  const { getUserDataFromToken } = useUserData()
  const { push } = useRouter()
  const [isShowMenu, setShowMenu] = useState(false)
  const [myRoles, setMyRoles] = useState()
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

  function goToEditMyGroup() {
    push("/soon")
  }

  function goToEditAllSoonList() {
    push("/remove/soon/all-list")
  }

  function goToManageGroup() {
    push("/remove/group/manage-group")
  }

  function goToSoonMe() {
    push("/remove/soon/me")
  }

  function goToDarakGroupManagement() {
    push("/admin/darak/group")
  }

  function goToDarakPeopleManagement() {
    push("/admin/darak/people")
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
                <ListItemText primary={"나의 정보 수정"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToSoonMe}>
                <ListItemIcon>
                  <PermIdentityOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"나의 순 정보 수정"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToEditMyGroup}>
                <ListItemIcon>
                  <PeopleOutlineOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"순원 정보 관리"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToManageGroup}>
                <ListItemIcon>
                  <ApartmentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"다락방 관리"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToEditAllSoonList}>
                <ListItemIcon>
                  <GroupsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"순 관리"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToDarakGroupManagement}>
                <ListItemIcon>
                  <LibraryAddCheckOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"다락방 그룹 관리 (준호가 개발중)"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={goToDarakPeopleManagement}>
                <ListItemIcon>
                  <LibraryAddCheckOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={"다락방 인원 관리 (준호가 개발중)"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Stack>
  )
}
