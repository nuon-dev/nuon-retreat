import { Stack } from "@mui/system"
import { useEffect, useState } from "react"
import { post } from "./api"
import { User } from "@entity/user"
import UserInformationForm from "../components/form/UserInformationForm"
import { InOutInfo } from "@entity/inOutInfo"

export default function Edit() {
  const [userData, setUserData] = useState({} as User)
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])

  useEffect(() => {
    checkToken()
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
        <UserInformationForm
          user={userData}
          inOutData={inOutData}
          checkToken={checkToken}
        />
      </Stack>
    </Stack>
  )
}
