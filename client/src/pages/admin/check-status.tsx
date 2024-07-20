import { CurrentStatus } from "@entity/types"
import { User } from "@entity/user"
import { MenuItem, Select, Stack } from "@mui/material"
import { post } from "pages/api"
import { useEffect, useRef, useState } from "react"
//@ts-ignore
import QrReader from "react-qr-scanner"

export default function CheckStatus() {
  const [cameraId, setCameraId] = useState("")
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])
  const [selectState, setSelectState] = useState(CurrentStatus.null)
  const [lastScanTime, setLastScanTime] = useState(new Date())
  const [user, setUser] = useState<User>({} as any)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    loadCamera()
    setInterval(() => {
      //setCurrentTime(new Date())
    }, 3000)
  }, [])

  async function loadCamera() {
    await navigator.mediaDevices.getUserMedia({ video: true })
    const deviceList = await navigator.mediaDevices.enumerateDevices()
    setCameraList(deviceList.filter((device) => device.kind === "videoinput"))
    setCameraId(
      deviceList.filter((device) => device.kind === "videoinput")[0].deviceId
    )
  }

  async function onScan(data: { text: string }) {
    if (!data) {
      return
    }
    const now = new Date()
    if (now.getTime() - lastScanTime.getTime() < 1000 * 2) {
      return
    }
    const scanDataList = data.text.split("/")
    if (scanDataList.length !== 2) {
      return
    }
    const [userInfo, scanUserTime] = scanDataList
    if (!userInfo) {
      return
    }

    const diff = Number.parseInt(scanUserTime) - now.getTime()
    const diffSecond = Math.abs(diff / 1000)

    if (diffSecond > 20) {
      return
    }
    setLastScanTime(now)

    const response = await post("/status/set", {
      userId: userInfo,
      status: selectState,
    })

    setUser(response)

    const audio = new Audio("/scan_alert.mp3")
    audio.play()
  }

  return (
    <Stack padding="24px" gap="24px">
      <Select onChange={(e) => setCameraId(e.target.value)} value={cameraId}>
        {cameraList.map((camera) => (
          <MenuItem key={camera.deviceId} value={camera.deviceId}>
            {camera.label}
          </MenuItem>
        ))}
      </Select>
      <Select
        onChange={(e) => setSelectState(e.target.value as CurrentStatus)}
        value={selectState}
      >
        <MenuItem value={CurrentStatus.null}>초기화</MenuItem>
        <MenuItem value={CurrentStatus.arriveChurch}>교회 도착</MenuItem>
        <MenuItem value={CurrentStatus.arriveAuditorium}>
          수련회장 도착
        </MenuItem>
      </Select>
      {cameraId && (
        <QrReader
          key={selectState.toString() + (user.id || "") + currentTime.getTime()}
          constraints={
            cameraId && { audio: false, video: { deviceId: cameraId } }
          }
          onScan={onScan}
        />
      )}
      {user.name && (
        <Stack>
          {user.name}[{user.age}]
        </Stack>
      )}
    </Stack>
  )
}
