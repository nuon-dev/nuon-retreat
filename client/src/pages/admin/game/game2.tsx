import { Box, Button, MenuItem, Select, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { get, post } from "pages/api"
import { useRouter } from "next/router"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"

const SIZE = 8

type Position = {
  x: number
  y: number
}

const colors = [
  "#F7AD97",
  "#E2BBD8",
  "#87B27C",
  "#7DB0C7",
  "#7774B6",
  "#B780A9",
  "#B1A995",
  "#333F4D",
]

export default function Game2() {
  const { push } = useRouter()
  const [moveHistory, setMoveHistory] = useState<Array<Position>>([])
  const [walls, setWalls] = useState<Array<[Position, Position]>>([])
  const [startWalls, setStartWalls] = useState<Position>({ x: -1, y: -1 })
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const [userType, setUserType] = useState(1)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [userPosition, setUserPosition] = useState<Position>(startPoint)
  const [userPositionList, setUserPositionList] = useState([])

  useEffect(() => {
    checkPermission()
    getWallData()
  }, [])

  useEffect(() => {
    if (userType !== 0) {
      return
    }
    getAllList()
    setInterval(getAllList, 1000)
  }, [userType])

  function getWallData() {
    const wallData = localStorage.getItem("walls")
    if (!wallData) {
      return
    }
    setWalls(JSON.parse(wallData))
  }

  async function checkPermission() {
    try {
      await get(`/admin/game/game1/check-permission`)
    } catch {
      push("/admin")
      setNotificationMessage("권한이 없습니다.")
      return
    }
  }

  async function setPositionToServe(
    prePosition: Position,
    currentPosition: Position
  ) {
    await post("/admin/game/game2/set-position", {
      teamNumber: userType,
      currentPositionX: currentPosition.x,
      currentPositionY: currentPosition.y,
      lastPositionX: prePosition.x,
      lastPositionY: prePosition.y,
      moveCount: 1,
    })
  }

  async function getAllList() {
    const data = await get("/admin/game/game2/all-position")
    setUserPositionList(data)
  }

  function AllowButton() {
    return (
      <Stack justifyContent="space-evenly">
        <Stack direction="row">
          <Box width="15vw" height="15vw" />
          <Button
            variant="contained"
            style={{
              width: "15vw",
              height: "15vw",
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
          <Box width="15vw" height="15vw" />
        </Stack>
        <Stack direction="row">
          <Button
            variant="contained"
            style={{
              width: "15vw",
              height: "15vw",
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
          <Box width="15vw" height="15vw" />
          <Button
            variant="contained"
            style={{
              width: "15vw",
              height: "15vw",
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
          <Box width="15vw" height="15vw" />
          <Button
            variant="contained"
            style={{
              width: "15vw",
              height: "15vw",
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
          <Box width="15vw" height="15vw" />
        </Stack>
      </Stack>
    )
  }

  async function movePreventPosition() {
    const lastPosition = moveHistory.pop()
    if (!lastPosition) {
      return
    }

    await post("/admin/game/game2/set-position", {
      teamNumber: userType,
      currentPositionX: lastPosition.x,
      currentPositionY: lastPosition.y,
      lastPositionX:
        moveHistory.length === 0
          ? lastPosition.x
          : moveHistory[moveHistory.length - 1].x,
      lastPositionY:
        moveHistory.length === 0
          ? lastPosition.y
          : moveHistory[moveHistory.length - 1].y,
      moveCount: -1,
    })

    setMoveHistory([...moveHistory])
    setUserPosition(lastPosition)
  }

  async function move(position: Position) {
    await setPositionToServe(userPosition, position)
    setMoveHistory([...moveHistory, userPosition])
    setUserPosition(position)
  }

  function setWall(position: Position) {
    if (startWalls.x === -1) {
      setStartWalls(position)
      return
    }

    if (isSamePosition([startWalls, position])) {
      setStartPoint(position)
      setStartWalls({ x: -1, y: -1 })
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

    localStorage.setItem(
      "walls",
      JSON.stringify([...walls, [startWalls, position]])
    )
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

    const inTeams = userPositionList.filter(
      (data: any) =>
        data.currentPositionX === colIndex && data.currentPositionY === rowIndex
    )

    const inTeamBacks = userPositionList.filter(
      (data: any) =>
        data.lastPositionX === colIndex && data.lastPositionY === rowIndex
    )

    return (
      <Stack
        key={`col_${colIndex}`}
        width="10vw"
        height="10vw"
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
        {userType !== 0 &&
          userPosition.y === rowIndex &&
          userPosition.x === colIndex && (
            <Box
              bgcolor={colors[userType]}
              width="6vw"
              height="6vw"
              borderRadius="50px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              {rowIndex * SIZE + colIndex + 1}
            </Box>
          )}
        {userType !== 0 && foundHistoryIndex !== -1 && (
          <Box
            bgcolor="#ccc"
            width="6vw"
            height="6vw"
            borderRadius="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {rowIndex * SIZE + colIndex + 1}
          </Box>
        )}
        {foundHistoryIndex === -1 &&
          !(userPosition.y === rowIndex && userPosition.x === colIndex) &&
          rowIndex * SIZE + colIndex + 1}
        {inTeams.map((team: any) => (
          <Box
            bgcolor={colors[team.teamNumber - 1]}
            width="6vw"
            height="6vw"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            borderRadius="50px"
          >{`${team.teamNumber}조`}</Box>
        ))}
        {inTeamBacks.map((team: any) => (
          <Box
            bgcolor={colors[team.teamNumber - 1]}
            width="6vw"
            height="6vw"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            borderRadius="50px"
          >
            {`${team.teamNumber}조`}
          </Box>
        ))}
      </Stack>
    )
  }

  function DeleteAll() {
    async function callServer() {
      await post("/admin/game/game2/reset", {})
    }
    return (
      <Button variant="contained" onClick={callServer}>
        전체 삭제
      </Button>
    )
  }

  function TeamSelect() {
    return (
      <Select
        value={userType}
        onChange={(e) => setUserType(e.target.value as number)}
      >
        <MenuItem value={0}>관리자</MenuItem>
        <MenuItem value={1}>1조</MenuItem>
        <MenuItem value={2}>2조</MenuItem>
        <MenuItem value={3}>3조</MenuItem>
        <MenuItem value={4}>4조</MenuItem>
      </Select>
    )
  }

  function DashBoard() {
    return (
      <Stack
        gap="12px"
        p="24px"
        border="1px solid black"
        ml="24px"
        borderRadius="24px"
      >
        {userPositionList.map((userInfo: any) => (
          <Stack fontSize="20px">
            {userInfo.teamNumber}조 이동 수: {userInfo.moveCount}
          </Stack>
        ))}
      </Stack>
    )
  }

  return (
    <Stack height="100vh" gap="24px" p="24px" width="100vw">
      <TeamSelect />
      <Stack alignItems="center">
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
      <Stack p="12px">
        {userType !== 0 && (
          <Stack
            justifyContent="space-evenly"
            direction="row"
            alignItems="center"
          >
            <AllowButton />
            <Stack ml="24px" gap="24px">
              <Button
                variant="contained"
                color="error"
                onClick={movePreventPosition}
                style={{
                  width: "15vw",
                  height: "15vw",
                }}
              >
                이전
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setUserPosition(startPoint)
                  setMoveHistory([])
                }}
                style={{
                  width: "15vw",
                  height: "15vw",
                }}
              >
                리셋
              </Button>
            </Stack>
          </Stack>
        )}
        {userType === 0 && (
          <Stack direction="row">
            <DeleteAll />
            <DashBoard />
          </Stack>
        )}
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
