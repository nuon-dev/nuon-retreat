import { CurrentStatus } from "@entity/types"
import { User } from "@entity/user"
import { MenuItem, Select, Stack } from "@mui/material"
import { post } from "pages/api"
import { useEffect, useRef, useState } from "react"
import Quagga from "quagga"

export default function CheckStatus(props: any) {
  const [cameraId, setCameraId] = useState("")
  const [selectState, setSelectState] = useState(CurrentStatus.null)
  const [lastScanTime, setLastScanTime] = useState(new Date())
  const [user, setUser] = useState<User>({} as any)

  const firstUpdate = useRef(true)
  const [isStart, setIsStart] = useState(false)
  const [barcode, setBarcode] = useState("")

  useEffect(() => {
    return () => {
      if (isStart) stopScanner()
    }
  }, [])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    if (isStart) startScanner()
    else stopScanner()
  }, [isStart])

  const _onDetected = (res) => {
    setBarcode(res.codeResult.code)
    console.log(res.codeResult.code)
  }

  const startScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            facingMode: "environment", // or user
          },
        },
        numOfWorkers: navigator.hardwareConcurrency,
        locate: true,
        frequency: 1,
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
        },
        multiple: false,
        locator: {
          halfSample: false,
          patchSize: "large", // x-small, small, medium, large, x-large
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
              showTransformed: false,
              showTransformedBox: false,
              showBB: false,
            },
          },
        },
        decoder: {
          readers: props.readers,
        },
      },
      (err) => {
        if (err) {
          return console.log(err)
        }
        Quagga.start()
      }
    )
    Quagga.onDetected(_onDetected)
    Quagga.onProcessed((result) => {
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          )
          result.boxes
            .filter((box) => box !== result.box)
            .forEach((box) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              })
            })
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          })
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          )
        }
      }
    })
  }

  const stopScanner = () => {
    return
    Quagga.offProcessed()
    Quagga.offDetected()
    Quagga.stop()
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
      <button
        onClick={() => setIsStart((prevStart) => !prevStart)}
        style={{ marginBottom: 20 }}
      >
        {isStart ? "Stop" : "Start"}
      </button>
      {isStart && (
        <>
          <div
            id="scanner-container"
            style={{
              position: "relative",
            }}
          />
          <span>Barcode: {barcode}</span>
        </>
      )}
      {user.name && (
        <Stack>
          {user.name}[{user.age}]
        </Stack>
      )}
    </Stack>
  )
}
