import { Stack } from "@mui/system"
import { useEffect, useState } from "react"

import { User } from "@entity/user"
import { InOutInfo } from "@entity/inOutInfo"
import { get, post } from "pages/api"
import UserInformationForm from "components/form/UserInformationForm"

export default function Receipt() {
  const COUNT_TINE = 10
  let count = COUNT_TINE
  const [userData, setUserData] = useState({} as User)
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])

  let startTimer = false
  useEffect(() => {
    checkToken()
    if (startTimer === false) {
      startTimer = true
    }
  }, [])

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

  //@ts-ignore
  const roomList: any = roomMatch[userData.sex]

  return (
    <Stack padding="12px" bgcolor="#e6e0d1" gap="12px" pb="72px">
      {userData.deposit ? (
        <Stack
          px="24px"
          py="12px"
          fontWeight="500"
          textAlign="center"
          border="solid #bda786 2px"
          borderRadius="12px"
          color="#bda786"
        >
          입금 확인이 완료 되었습니다.
        </Stack>
      ) : (
        <Stack
          padding="5px"
          marginTop="10px"
          borderRadius="40px"
          textAlign="center"
          alignItems="center"
          justifyContent="center"
          border="1px solid grey"
        >
          <Stack fontSize="20px" fontWeight="bold">
            수련회비 안내
          </Stack>
          <Stack
            mt="6px"
            lineHeight="24px"
            style={{
              userSelect: "text",
            }}
          >
            {" "}
            3333276342153 카카오뱅크 (조영래)
            <br />
            회비 : 10만원 (직장인), 7만원 (대학생)
          </Stack>
        </Stack>
      )}

      <Stack
        p="12px"
        alignItems="center"
        justifyContent="center"
        borderRadius="24px"
        bgcolor="#f7f4ef"
      >
        <UserInformationForm
          user={userData}
          inOutData={inOutData}
          reloadFunction={checkToken}
        />
      </Stack>
    </Stack>
  )
}
