import { Button, MenuItem, Select, FormControl, TextField } from "@mui/material"
import { Stack } from "@mui/system"
import { InOutInfo } from "@entity/inOutInfo"
import { User } from "@entity/user"
import { post } from "../../pages/api"
import { useEffect, useState } from "react"
import InOutFrom from "./InOutForm"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"
import { HowToGo, InOutType } from "types"
import { useRouter } from "next/router"
interface IProps {
  user: User
  inOutData: Array<InOutInfo>
  reloadFunction: () => void
}

export default function UserInformationForm(props: IProps) {
  const router = useRouter()
  const [userInformation, setUserInformation] = useState(new User())
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
  const [showItems, setShowItems] = useState(false)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    setShowItems(false)
    setUserInformation(props.user || ({} as User))
    setInOutData(props.inOutData || ({} as Array<InOutInfo>))
    if (props.user && props.user.id) {
      setShowItems(true)
    }
  }, [props.user])

  const changeInformation = (type: string, data: string) => {
    setUserInformation({ ...userInformation, [type]: data })
  }

  const submit = async () => {
    if (!userInformation.name) {
      setNotificationMessage("이름을 입력해주세요.")
      return
    } else if (!userInformation.age) {
      setNotificationMessage("나이를 입력해주세요.")
      return
    } else if (!userInformation.sex) {
      setNotificationMessage("성별을 선택해주세요.")
      return
    } else if (!userInformation.phone) {
      setNotificationMessage("전화번호를 입력해주세요.")
      return
    } else if (!userInformation.howToGo) {
      setNotificationMessage("이동 방법을 선택해주세요.")
      return
    } else if (!userInformation.howToLeave) {
      setNotificationMessage("이동 방법을 선택해주세요.")
      return
    }

    const url = "/auth/edit-user"

    const saveResult = await post(url, userInformation)
    let attendTimeResult
    // @ts-ignore
    if (inOutData.length > 0 && userInformation.howToGo !== HowToGo.together) {
      attendTimeResult = await post("/info/save-attend-time", {
        userId: saveResult.userId,
        inOutData,
      })
    }

    if (saveResult.result !== "success") {
      setNotificationMessage(
        "접수중 오류가 발생하였습니다.\n다시 시도해주세요."
      )
      return
    }

    if (router.pathname !== "/admin/edit-user-data") {
      localStorage.setItem("token", saveResult.token)
    }

    if (attendTimeResult && attendTimeResult.result !== "success") {
      setNotificationMessage(
        "참가 일정 내역 저장중에 문제가 발생하였습니다.\n시간, 장소. 이동방법을 모두 입력해주세요."
      )
      return
    }
    setNotificationMessage(`신청 내역이 저장이 되었습니다.`)
    props.reloadFunction()
  }

  function getInputGap() {
    return <Stack margin="6px" />
  }

  function getLabelGap() {
    return <Stack margin="2px" />
  }

  return (
    <Stack padding="6px" minWidth="360px">
      <Stack>
        {getInputGap()}
        <Stack>이름</Stack>
        {getLabelGap()}
        <TextField
          fullWidth={true}
          value={userInformation.name}
          placeholder="이름을 입력하세요."
          onChange={(e) => changeInformation("name", e.target.value)}
        />
      </Stack>
      {getInputGap()}
      <Stack>
        <Stack width="80px" justifyContent="center">
          전화번호
        </Stack>
        {getLabelGap()}
        <TextField
          fullWidth={true}
          value={userInformation.phone}
          placeholder="전화번호를 입력하세요."
          onChange={(e) => changeInformation("phone", e.target.value)}
        />
      </Stack>
      {getInputGap()}
      <Stack>
        <Stack width="200px" justifyContent="center">
          출생년도 (빠른은 친구 기준)
        </Stack>
        {getLabelGap()}
        {userInformation && (
          <Select
            fullWidth={true}
            key={userInformation.age}
            value={userInformation.age}
            defaultValue={userInformation.age}
            onChange={(e) =>
              changeInformation("age", e.target.value.toString())
            }
          >
            {new Array(45).fill(0).map((_, index) => (
              <MenuItem value={new Date().getFullYear() - index - 19}>
                {new Date().getFullYear() - index - 19}
              </MenuItem>
            ))}
          </Select>
        )}
      </Stack>
      {getInputGap()}
      <Stack>
        <Stack width="80px" justifyContent="center">
          성별
        </Stack>
        {getLabelGap()}
        <FormControl fullWidth={true}>
          {
            // @ts-ignore
            showItems && (
              <Select
                value={userInformation.sex}
                defaultValue={userInformation.sex}
                placeholder="성별을 선택하세요."
                onChange={(e) => changeInformation("sex", e.target.value)}
              >
                <MenuItem value={"man"}>남</MenuItem>
                <MenuItem value={"woman"}>여</MenuItem>
              </Select>
            )
          }
        </FormControl>
      </Stack>
      {getInputGap()}
      <Stack>
        {getInputGap()}
        <Stack minWidth="100px" justifyContent="center">
          수련회장 이동 방법
        </Stack>
        {getLabelGap()}
        <Select
          fullWidth={true}
          key={userInformation.howToGo}
          defaultValue={userInformation.howToGo}
          value={userInformation.howToGo}
          onChange={(e) =>
            changeInformation("howToGo", e.target.value.toString())
          }
        >
          <MenuItem value={HowToGo.together.toString()}>교회 버스로</MenuItem>
          <MenuItem value={HowToGo.etc.toString()}>
            기타 (자차 및 카풀)
          </MenuItem>
        </Select>
        {
          // @ts-ignore
          userInformation.howToGo !== HowToGo.together && (
            <Stack ml="10px">
              <InOutFrom setInOutData={setInOutData} inOutData={inOutData} />
            </Stack>
          )
        }
      </Stack>
      {getInputGap()}
      <Stack>
        {getInputGap()}
        <Stack minWidth="100px" justifyContent="center">
          교회로 오는 차
        </Stack>
        {getLabelGap()}
        <Select
          fullWidth={true}
          key={userInformation.howToLeave}
          defaultValue={userInformation.howToLeave}
          value={userInformation.howToLeave}
          onChange={(e) =>
            changeInformation("howToLeave", e.target.value.toString())
          }
        >
          <MenuItem value={HowToGo.together.toString()}>교회 버스로</MenuItem>
          <MenuItem value={HowToGo.etc.toString()}>
            기타 (자차 및 카풀)
          </MenuItem>
        </Select>
      </Stack>
      {getInputGap()}
      <Stack>
        <Stack width="80px" justifyContent="center">
          기타사항
        </Stack>
        {getLabelGap()}
        <TextField
          fullWidth={true}
          value={userInformation.etc}
          placeholder="기타사항이 있을 경우 입력하세요."
          onChange={(e) => changeInformation("etc", e.target.value)}
        />
      </Stack>
      {getInputGap()}

      <Stack marginTop="10px">
        <Button variant="contained" onClick={submit}>
          저장
        </Button>
      </Stack>
    </Stack>
  )
}
