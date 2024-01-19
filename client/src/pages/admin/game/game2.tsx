import { Box, Button, Stack } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { get, post } from "pages/api"
import { useRouter } from "next/router"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"
import { access } from "fs"

const SIZE = 7

type Position = {
  x: number
  y: number
}

export default function Game2() {
  const { push } = useRouter()
  const [userPosition, setUserPosition] = useState<Position>({
    x: 0,
    y: SIZE - 1,
  })
  const [moveHistory, setMoveHistory] = useState<Array<Position>>([])
  const [walls, setWalls] = useState<Array<[Position, Position]>>([])
  const [startWalls, setStartWalls] = useState<Position>({ x: -1, y: -1 })
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
      <Stack justifyContent="space-evenly" mt="24px">
        <Stack direction="row">
          <Box width="100px" height="100px" />
          <Button
            variant="contained"
            style={{
              width: "100px",
              height: "100px",
            }}
            onClick={() =>
              move({
                x: userPosition.x,
                y: userPosition.y - 1,
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
              move({
                x: userPosition.x - 1,
                y: userPosition.y,
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
              move({
                x: userPosition.x + 1,
                y: userPosition.y,
              })
            }
          >
            우
          </Button>
        </Stack>
        <Stack direction="row">
          <Box width="100px" height="100px" />
          <Button
            variant="contained"
            style={{
              width: "100px",
              height: "100px",
            }}
            onClick={() =>
              move({
                x: userPosition.x,
                y: userPosition.y + 1,
              })
            }
          >
            하
          </Button>
          <Box width="100px" height="100px" />
        </Stack>
      </Stack>
    )
  }

  function move(position: Position) {
    setMoveHistory([...moveHistory, position])
    setUserPosition(position)
  }

  function setWall(position: Position) {
    if (startWalls.x === -1) {
      setStartWalls(position)
      return
    }

    const foundWallInfo = walls.find(
      (wall) =>
        (isSamePosition([wall[0], startWalls]) &&
          isSamePosition([wall[1], position])) ||
        (isSamePosition([wall[0], position]) &&
          isSamePosition([wall[1], startWalls]))
    )
    if (foundWallInfo) {
      setWalls([
        ...walls.filter(
          (wall) =>
            !(
              (isSamePosition([wall[0], startWalls]) &&
                isSamePosition([wall[1], position])) ||
              (isSamePosition([wall[0], position]) &&
                isSamePosition([wall[1], startWalls]))
            )
        ),
      ])
      setStartWalls({ x: -1, y: -1 })
      return
    }

    setWalls([...walls, [startWalls, position]])
    setStartWalls({ x: -1, y: -1 })
  }

  function Sell({
    rowIndex,
    colIndex,
  }: {
    rowIndex: number
    colIndex: number
  }) {
    const position: Position = {
      x: colIndex,
      y: rowIndex,
    }
    const foundHistoryIndex = moveHistory.findIndex((p) =>
      isSamePosition([p, position])
    )

    if (foundHistoryIndex !== -1) {
      const before =
        foundHistoryIndex === 0
          ? moveHistory[0]
          : moveHistory[foundHistoryIndex]
      const after =
        foundHistoryIndex === moveHistory.length - 1
          ? moveHistory[moveHistory.length - 1]
          : moveHistory[foundHistoryIndex]
    }

    const myWalls = walls.filter(
      (wall) =>
        isSamePosition([wall[0], position]) ||
        isSamePosition([wall[1], position])
    )

    let wallList: Position[] = []
    if (myWalls.length > 0) {
      const positionList = myWalls.reduce(
        (acc, current) => [...acc, ...current],
        []
      )
      const otherPositionList = positionList.filter(
        (p) => !isSamePosition([p, position])
      )
      otherPositionList.map((otherPosition) => {
        wallList.push({
          x: otherPosition.x - position.x,
          y: otherPosition.y - position.y,
        })
      })
    }

    return (
      <Stack
        key={`col_${colIndex}`}
        width="100px"
        height="100px"
        borderTop={`3px solid ${
          wallList.find((p) => p.y === -1) ? "red" : "black"
        }`}
        borderBottom={`3px solid ${
          wallList.find((p) => p.y === 1) ? "red" : "black"
        }`}
        borderLeft={`3px solid ${
          wallList.find((p) => p.x === -1) ? "red" : "black"
        }`}
        borderRight={`3px solid ${
          wallList.find((p) => p.x === 1) ? "red" : "black"
        }`}
        alignItems="center"
        justifyContent="center"
        bgcolor={
          rowIndex === startWalls.y && colIndex === startWalls.x ? "red" : ""
        }
        onClick={() => {
          setWall({ x: colIndex, y: rowIndex })
        }}
      >
        {rowIndex + 1},{colIndex + 1}
        {userPosition.y === rowIndex && userPosition.x === colIndex && (
          <Box bgcolor="red" width="50px" height="50px" borderRadius="50px" />
        )}
      </Stack>
    )
  }

  return (
    <Stack height="100vh">
      <Stack alignItems="center" mt="24px">
        {new Array(SIZE).fill(0).map((_, rowIndex) => {
          return (
            <Stack key={`row_${rowIndex}`} direction="row">
              {new Array(SIZE).fill(0).map((_, colIndex) => (
                <Sell rowIndex={rowIndex} colIndex={colIndex} />
              ))}
            </Stack>
          )
        })}
      </Stack>
      <Stack justifyContent="space-evenly" direction="row" alignItems="center">
        <AllowButton />
        <Button
          variant="outlined"
          onClick={() => {
            setUserPosition({
              x: 0,
              y: SIZE - 1,
            })
          }}
          style={{
            width: "100px",
            height: "100px",
          }}
        >
          리셋
        </Button>
      </Stack>
    </Stack>
  )
}

function isSamePosition([first, second]: [Position, Position]) {
  return first.x === second.x && first.y === second.y
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
