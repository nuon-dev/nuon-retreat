import { Stack } from "@mui/system"
import { useEffect, useState } from "react"
import { get, post } from "./api"
import { User } from "@entity/user"
import UserInformationForm from "../components/form/UserInformationForm"
import { InOutInfo } from "@entity/inOutInfo"

export default function Edit() {
  const COUNT_TINE = 10
  let count = COUNT_TINE
  const [userData, setUserData] = useState({} as User)
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
  const [roomMateList, setRoomMateList] = useState<Array<User>>([])
  const [groupMateList, setGroupMateList] = useState<Array<User>>([])
  const [showMate, setShowMate] = useState(false)
  const [countdown, setCountdown] = useState(count)

  const targetDate = new Date("2023-08-18 13:45:00")

  let startTimer = false
  useEffect(() => {
    checkToken()
    fetchRoomAndGroupData()
    startCountdown()
    if (startTimer === false) {
      startTimer = true
      setTimeout(() => {
        count = COUNT_TINE
        setShowMate(true)
      }, targetDate.getTime() - new Date().getTime())
    }
  }, [])

  function startCountdown() {
    if (count !== COUNT_TINE) {
      return
    }
    count--
    setInterval(() => {
      setCountdown(count--)
    }, 1000)
  }

  async function fetchRoomAndGroupData() {
    const { roomMate, groupMate } = await get("/info/my-mate")
    setRoomMateList(roomMate)
    setGroupMateList(groupMate)
  }

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return
    }
    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        setUserData(response.userData)
        setInOutData(response.inoutInfoList)
      }
    })
  }

  const roomMatch = {
    man: {
      1: "311",
      2: "312",
      3: "313",
      4: "314",
      5: "315",
      6: "316",
      7: "317",
      8: "318",
      9: "319",
      10: "320",
      11: "401",
      12: "402",
      13: "403",
      14: "404",
      15: "405",
      16: "406",
      17: "407",
      18: "408",
      19: "409",
      20: "410",
      21: "411",
      22: "412",
      23: "413",
      24: "414",
      25: "415",
      31: "준비팀",
      32: "준비팀",
      33: "준비팀",
    },
    woman: {
      1: "201",
      2: "202",
      3: "203",
      4: "204",
      5: "205",
      6: "206",
      7: "207",
      8: "208",
      9: "209",
      10: "210",
      11: "211",
      12: "212",
      13: "213",
      14: "214",
      15: "215",
      16: "216",
      17: "217",
      18: "218",
      19: "219",
      20: "220",
      21: "221",
      22: "222",
      23: "306",
      24: "307",
    },
  }

  return (
    <Stack padding="12px">
      <Stack alignItems="center" justifyContent="center">
        {userData.deposit ? (
          <Stack
            px="24px"
            py="12px"
            fontWeight="500"
            color="#099"
            style={{
              borderRadius: "12px",
              border: "solid #AAA 2px",
            }}
          >
            입금 처리가 {userData.deposit ? "완료 되었습" : "진행 중입"}니다.
          </Stack>
        ) : (
          <Stack
            maxWidth="400px"
            padding="5px"
            marginTop="10px"
            bgcolor="#03C0A4"
            borderRadius="5px"
            textAlign="center"
            alignItems="center"
            justifyContent="center"
            border="1px solid 008000"
          >
            <Stack fontSize="20px" fontWeight="bold" color="whitesmoke">
              수련회비 안내
            </Stack>
            <Stack
              color="white"
              mt="6px"
              style={{
                userSelect: "text",
              }}
            >
              {" "}
              3333276342153 카카오뱅크 (조영래)
              <br />
              전체 5만
            </Stack>
          </Stack>
        )}
        {showMate && (
          <Stack
            mt="12px"
            padding="8px"
            borderRadius="16px"
            alignItems="center"
          >
            <Stack fontSize="20px" fontWeight="500">
              방 & 조 배정 공개!!
            </Stack>
            {countdown > 0 ? (
              <Stack mt="12px" fontSize="20px" fontWeight="bold" color="red">
                {countdown}초 후에 공개됩니다!.
              </Stack>
            ) : (
              <Stack direction="row" pt="12px">
                <Stack
                  ml="20px"
                  width="120px"
                  sx={{
                    margin: "16px",
                    minHeight: "20px",
                    borderRadius: "8px",
                    boxShadow: "2px 2px 5px 3px #ACACAC;",
                    border: "1px solid #ACACAC",
                  }}
                >
                  <Stack textAlign="center">
                    {userData.groupAssignment?.groupNumber}조
                  </Stack>
                  {groupMateList.map((groupMate) => (
                    <Stack
                      p="2px"
                      sx={{
                        backgroundColor:
                          groupMate.sex === "man" ? "lightblue" : "pink",
                      }}
                    >
                      {groupMate.name} ({groupMate.age})
                    </Stack>
                  ))}
                </Stack>

                <Stack
                  width="120px"
                  sx={{
                    margin: "16px",
                    minHeight: "20px",
                    borderRadius: "8px",
                    boxShadow: "2px 2px 5px 3px #ACACAC;",
                    border: "1px solid #ACACAC",
                  }}
                >
                  <Stack textAlign="center">
                    {userData.roomAssignment?.roomNumber}번방{" "}
                    {
                      roomMatch[userData.sex][
                        userData.roomAssignment?.roomNumber
                      ]
                    }
                    호
                  </Stack>
                  {roomMateList
                    .filter((user: User) => user.sex === userData.sex)
                    .map((roomMate) => (
                      <Stack
                        p="2px"
                        sx={{
                          backgroundColor:
                            roomMate.sex === "man" ? "lightblue" : "pink",
                        }}
                      >
                        {roomMate.name} ({roomMate.age})
                      </Stack>
                    ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
        <UserInformationForm
          user={userData}
          inOutData={inOutData}
          reloadFunction={checkToken}
        />
      </Stack>
    </Stack>
  )
}
