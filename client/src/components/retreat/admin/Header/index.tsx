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
import useUserData from "@/hooks/useUserData"
import Image from "next/image"

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

  function goToHome() {
    push("/retreat/admin")
  }

  function RouterRow({
    pageURL,
    pageName,
    icon,
  }: {
    pageURL: string
    pageName: string
    icon: string
  }) {
    function goToPage() {
      push("/retreat/admin" + pageURL)
    }
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={goToPage}>
          <ListItemIcon>
            <Image src={icon} width="30" height="30" alt="" />
          </ListItemIcon>
          <ListItemText primary={pageName} />
        </ListItemButton>
      </ListItem>
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
      <Stack direction="row" alignItems="center" gap="8px">
        <Button onClick={goToHome}>
          <img width="80px" src="/logo_white.png" />
        </Button>
        <Stack fontSize="32px" fontWeight="bold" color="white">
          수련회 관리자
        </Stack>
      </Stack>
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
            {RouterRow({
              pageName: "접수자 전체 조회",
              pageURL: "/all-user",
              icon: "/icon/free-icon-bullet-list.png",
            })}
            {RouterRow({
              pageName: "카풀 관리",
              pageURL: "/carpooling",
              icon: "/icon/free-icon-car.png",
            })}
            {RouterRow({
              pageName: "카풀 명단 조회",
              pageURL: "/carpooling-list",
              icon: "/icon/free-icon-car-list.png",
            })}
            {RouterRow({
              pageName: "방배정 관리",
              pageURL: "/room-assignment",
              icon: "/icon/free-icon-bunk-bed.png",
            })}
            {RouterRow({
              pageName: "조배정 관리",
              pageURL: "/group-formation",
              icon: "/icon/free-icon-group.png",
            })}
            {RouterRow({
              pageName: "권한 관리",
              pageURL: "/permission-manage",
              icon: "/icon/free-icon-lock.png",
            })}
            {RouterRow({
              pageName: "입금 확인 처리",
              pageURL: "/deposit-check",
              icon: "/icon/free-icon-cost.png",
            })}
            {RouterRow({
              pageName: "접수 내용 수정",
              pageURL: "/edit-user-data",
              icon: "/icon/free-icon-edit-profile.png",
            })}
            {RouterRow({
              pageName: "인원 확인 처리",
              pageURL: "/check-status",
              icon: "/icon/free-icon-qr-code.png",
            })}
            {RouterRow({
              pageName: "인원 관리",
              pageURL: "/show-status-table",
              icon: "/icon/free-icon-table.png",
            })}
            {RouterRow({
              pageName: "인원 출입 관리",
              pageURL: "/inout-info",
              icon: "/icon/free-icon-table.png",
            })}
            {RouterRow({
              pageName: "대시보드",
              pageURL: "/dash-board",
              icon: "/icon/free-icon-dashboard-interface.png",
            })}
          </List>
        </Box>
      </Drawer>
    </Stack>
  )
}
