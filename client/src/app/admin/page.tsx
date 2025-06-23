"use client"

import { useRouter } from "next/navigation"
import { Stack } from "@mui/material"
import { useEffect } from "react"
import Header from "@/components/AdminHeader"
import { useSetAtom } from "jotai"
import { NotificationMessage } from "@/state/notification"
import useUserData from "@/hooks/useUserData"

function index() {
  const router = useRouter()
  const { getUserDataFromToken, getUserDataFromKakaoLogin } = useUserData()
  const setNotificationMessage = useSetAtom(NotificationMessage)

  useEffect(() => {
    hasPermission()
  }, [])

  async function hasPermission() {
    let userData = await getUserDataFromToken()

    if (!userData) {
      userData = await getUserDataFromKakaoLogin()
    }
    if (!userData) {
      setNotificationMessage(
        "사용자 정보가 없습니다.\n로그인 화면으로 이동합니다."
      )
      router.push("/admin/login")
    }
  }

  return (
    <Stack
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Header />
      <Stack
        borderColor="#EEE"
        alignItems="center"
        justifyContent="center"
        borderRadius="12px"
        padding="60px"
      >
        <img src="/logo.png" width="120px" />
      </Stack>
    </Stack>
  )
}

export default index
