import { Box, Button, Stack } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { get, post } from "pages/api"

enum UserType {
  admin,
  payer1,
  payer2,
  payer3,
  payer4,
  none,
}

type ISeat = {
  seatClass: string
  position: number
}

function getUserColor(user: UserType) {
  switch (user) {
    case UserType.payer1:
      return "red"
    case UserType.payer2:
      return "blue"
    case UserType.payer3:
      return "green"
    case UserType.payer4:
      return "purple"
  }
}

export default function Game1() {
  const [user, setUserType] = useState(UserType.none)
  const [mySeats, setMySeats] = useState<(ISeat & { user: UserType })[]>([])

  useEffect(() => {
    fetchMySeat()
  }, [user])

  async function fetchMySeat() {
    if (user === UserType.admin) {
      setInterval(async () => {
        const mySeats = await get(`/admin/game/game1/all-seat?user=${user}`)
        setMySeats(mySeats)
      }, 1000)
      return
    }
    const mySeats = await get(`/admin/game/game1/my-seat?user=${user}`)
    setMySeats(mySeats)
  }

  async function onClickSeat({ seatClass, position }: ISeat) {
    if (user === UserType.admin) {
      await post("/admin/game/game1/delete", {
        user,
        seatClass,
        position,
      })
      return
    }
    const { result } = await post("/admin/game/game1/set-seat", {
      user,
      seatClass,
      position,
    })
    if (result === "fail") {
      alert("이미 예약된 자리입니다.")
      return
    }
    setMySeats([
      ...mySeats,
      {
        user,
        seatClass,
        position,
      },
    ])
  }

  function Seat({ seatClass, position }: ISeat) {
    const isMySeat = mySeats.find(
      (s) => s.position === position && s.seatClass === seatClass
    )

    return isMySeat ? (
      <MyStyle
        onClick={() => onClickSeat({ seatClass, position })}
        style={{
          backgroundColor: getUserColor(isMySeat.user),
        }}
      >
        {seatClass + position}
      </MyStyle>
    ) : (
      <SeatStyle onClick={() => onClickSeat({ seatClass, position })}>
        {seatClass + position}
      </SeatStyle>
    )
  }

  return (
    <Stack height="100vh">
      {user === UserType.none ? (
        <SelectUserSection setUserType={setUserType} />
      ) : (
        <Stack height="100%" alignItems="center" justifyContent="space-evenly">
          <Stack direction="row" justifyContent="space-evenly" width="100%">
            {new Array(10).fill(0).map((_, index) => {
              return <Seat seatClass="V" position={index + 1} />
            })}
          </Stack>

          <Stack direction="row" justifyContent="space-evenly" width="100%">
            {new Array(5).fill(0).map((_, index) => {
              return <Seat seatClass="R" position={index + 1} />
            })}
            <Box width="24px" />
            {new Array(5).fill(0).map((_, index) => {
              return <Seat seatClass="R" position={index + 6} />
            })}
            <Box width="24px" />
            {new Array(5).fill(0).map((_, index) => {
              return <Seat seatClass="R" position={index + 11} />
            })}
          </Stack>

          <Stack direction="row" justifyContent="space-evenly" width="100%">
            {new Array(5).fill(0).map((_, index) => {
              return <Seat seatClass="S" position={index + 1} />
            })}
            <Box width="24px" />
            {new Array(5).fill(0).map((_, index) => {
              return <Seat seatClass="S" position={index + 6} />
            })}
            <Box width="24px" />
            {new Array(5).fill(0).map((_, index) => {
              return <Seat seatClass="S" position={index + 11} />
            })}
          </Stack>

          <Stack direction="row" justifyContent="space-evenly" width="100%">
            {new Array(10).fill(0).map((_, index) => {
              return <Seat seatClass="A" position={index + 1} />
            })}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

type IProps = {
  setUserType: Dispatch<SetStateAction<UserType>>
}

function SelectUserSection({ setUserType }: IProps) {
  return (
    <Stack justifyContent="center" alignItems="center" p="40px" gap="24px">
      <Box fontSize="40px">사용자를 선택하세요</Box>
      <Button
        style={{
          fontSize: "40px",
        }}
        variant="contained"
        onClick={() => setUserType(UserType.payer1)}
      >
        사용자 1
      </Button>
      <Button
        style={{
          fontSize: "40px",
        }}
        variant="contained"
        onClick={() => setUserType(UserType.payer2)}
      >
        사용자 2
      </Button>
      <Button
        style={{
          fontSize: "40px",
        }}
        variant="contained"
        onClick={() => setUserType(UserType.payer3)}
      >
        사용자 3
      </Button>
      <Button
        style={{
          fontSize: "40px",
        }}
        variant="contained"
        onClick={() => setUserType(UserType.payer4)}
      >
        사용자 4
      </Button>
      <Button
        style={{
          fontSize: "40px",
        }}
        variant="contained"
        onClick={() => setUserType(UserType.admin)}
      >
        관리자
      </Button>
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
