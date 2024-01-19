import { Box, Button, Stack } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { get, post } from "pages/api"
import { useRouter } from "next/router"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"

const SIZE = 7

type Position = {
  x: number
  y: number
}

export default function Game2() {
  const { push } = useRouter()
  const [userPosition, setUserPosition] = useState<Position>({ x: 0, y: 0 })
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    checkPermission()
  }, [])

  async function checkPermission() {
    try {
      await get(`/admin/game/game1/check-permission`)
    } catch {
      push("/admin")
      setNotificationMessage("권한이 없습니다.")
      return
    }
  }

  function AllowButton() {
    return (
      <Stack justifyContent="space-evenly">
        <Stack direction="row">
          <Box width="100px" height="100px" />
          <Button
            variant="contained"
            style={{
              width: "100px",
              height: "100px",
            }}
            onClick={() =>
              setUserPosition({
                x: userPosition.x - 1,
                y: userPosition.y,
              })
            }
          >
            상
          </Button>
          <Box width="100px" height="100px" />
        </Stack>
        <Stack direction="row">
          <Button
            variant="contained"
            style={{
              width: "100px",
              height: "100px",
            }}
            onClick={() =>
              setUserPosition({
                x: userPosition.x,
                y: userPosition.y - 1,
              })
            }
          >
            좌
          </Button>
          <Box width="100px" height="100px" />
          <Button
            variant="contained"
            style={{
              width: "100px",
              height: "100px",
            }}
            onClick={() =>
              setUserPosition({
                x: userPosition.x,
                y: userPosition.y + 1,
              })
            }
          >
            우
          </Button>
        </Stack>
        <Button
          variant="contained"
          style={{
            width: "100px",
            height: "100px",
          }}
          onClick={() =>
            setUserPosition({
              x: userPosition.x + 1,
              y: userPosition.y,
            })
          }
        >
          하
        </Button>
      </Stack>
    )
  }

  return (
    <Stack height="100vh">
      <Stack alignItems="center" mt="24px">
        {new Array(SIZE).fill(0).map((_, rowIndex) => {
          return (
            <Stack key={`row_${rowIndex}`} direction="row">
              {new Array(SIZE).fill(0).map((_, colIndex) => {
                return (
                  <Stack
                    key={`col_${colIndex}`}
                    width="100px"
                    height="100px"
                    border="1px solid black"
                  >
                    {rowIndex + 1},{colIndex + 1}
                    {userPosition.x === rowIndex &&
                      userPosition.y === colIndex && (
                        <Box
                          bgcolor="red"
                          width="50px"
                          height="50px"
                          borderRadius="50px"
                        />
                      )}
                  </Stack>
                )
              })}
            </Stack>
          )
        })}
      </Stack>
      <Stack justifyContent="space-evenly" direction="row">
        <AllowButton />
      </Stack>
    </Stack>
  )
}

const SeatStyle = styled.div`
  width: 60px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  line-height: 60px;
  text-align: center;
  border-radius: 12px;
  background-color: #ccc;
  transition-duration: 0.3s;
  :active {
    background-color: #888;
  }
`

const MyStyle = styled.div`
  width: 60px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  line-height: 60px;
  text-align: center;
  border-radius: 12px;
  background-color: red;
  transition-duration: 0.3s;
  :active {
    background-color: #888;
  }
`
