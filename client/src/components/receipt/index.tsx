import { Stack } from "@mui/system"
import { useEffect, useState } from "react"

import { User } from "@entity/user"
import { InOutInfo } from "@entity/inOutInfo"
import { get, post } from "pages/api"
import UserInformationForm from "components/form/UserInformationForm"
import ReceiptResult from "components/form/ReceiptResult"

export default function Receipt() {
  const [userData, setUserData] = useState({} as User)
  const [isEditMode, setEditMode] = useState(false)
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
      if (response.result !== "true") {
        return
      }
      if (response.userData.isCancel) {
        const id = response.userData.id as number
        const kakaoId = response.userData.kakaoId as string
        setUserData({ kakaoId, id } as any)
        setEditMode(true)
        return
      }
      setUserData(response.userData)
      setInOutData(response.inoutInfoList)
    })
  }

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
        {isEditMode && (
          <UserInformationForm
            user={userData}
            inOutData={inOutData}
            reloadFunction={checkToken}
            setEditMode={setEditMode}
          />
        )}
        {!isEditMode && (
          <ReceiptResult
            user={userData}
            inOutData={inOutData}
            reloadFunction={checkToken}
            setEditMode={setEditMode}
          />
        )}
      </Stack>
    </Stack>
  )
}
