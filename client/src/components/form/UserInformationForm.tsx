import {
  Button,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Stack,
} from "@mui/material"
import { post } from "../../pages/api"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import InOutFrom from "./InOutForm"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"
import { useRouter } from "next/router"
import { HowToMove } from "@server/entity/types"
import { User } from "@server/entity/user"
import { InOutInfo } from "@server/entity/inOutInfo"
import { RetreatAttend } from "@server/entity/retreatAttend"

interface IProps {
  retreatAttend: RetreatAttend | undefined
  inOutData: Array<InOutInfo>
  reloadFunction: () => void
  setEditMode: Dispatch<SetStateAction<boolean>>
}

export default function UserInformationForm(props: IProps) {
  const router = useRouter()
  const [retreatAttend, setRetreatAttend] = useState<RetreatAttend | undefined>(
    undefined
  )
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    setRetreatAttend(props.retreatAttend)
    setInOutData(props.inOutData || ({} as Array<InOutInfo>))
  }, [props.retreatAttend])

  const changeInformation = (type: string, data: string) => {
    if (!retreatAttend) {
      return
    }
    setRetreatAttend({ ...retreatAttend, [type]: data })
  }

  const submit = async () => {
    if (!retreatAttend) {
      setNotificationMessage("수련회 접수 정보 없음.")
      return
    }
    if (!retreatAttend.howToGo) {
      setNotificationMessage("이동 방법을 선택해주세요.")
      return
    }
    if (
      retreatAttend.howToGo !== HowToMove.together &&
      inOutData.length === 0
    ) {
      setNotificationMessage("이동 방법을 추가해주세요.")
      return
    }
    if (!retreatAttend.howToBack) {
      setNotificationMessage("이동 방법을 선택해주세요.")
      return
    }

    const url = "/auth/edit-user"

    const saveResult = await post(url, retreatAttend)
    let attendTimeResult
    if (inOutData.length > 0) {
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
    props.setEditMode(false)
  }

  function getInputGap() {
    return <Stack margin="6px" />
  }

  function getLabelGap() {
    return <Stack margin="2px" />
  }

  return (
    <Stack padding="6px" minWidth="340px" gap="4px" color="white">
      <Stack>
        {getInputGap()}
        <Stack>이름</Stack>
        {getLabelGap()}
        <TextField
          fullWidth={true}
          className="TextField"
          value={retreatAttend?.user.name}
          placeholder="이름을 입력하세요."
          disabled
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
          className="TextField"
          value={retreatAttend?.user.phone}
          placeholder="전화번호를 입력하세요."
          disabled
        />
      </Stack>
      {getInputGap()}
      <Stack>
        <Stack width="200px" justifyContent="center">
          출생년도 (빠른은 기수 기준)
        </Stack>
        {getLabelGap()}
        {retreatAttend && (
          <Select
            fullWidth={true}
            className="Select"
            key={retreatAttend.user.yearOfBirth}
            value={retreatAttend.user.yearOfBirth}
            defaultValue={retreatAttend.user.yearOfBirth}
            disabled
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
          {retreatAttend?.user.kakaoId && (
            <Select
              value={retreatAttend.user.gender}
              className="Select"
              defaultValue={retreatAttend.user.gender}
              placeholder="성별을 선택하세요."
              disabled
            >
              <MenuItem value={"man"}>남</MenuItem>
              <MenuItem value={"woman"}>여</MenuItem>
            </Select>
          )}
        </FormControl>
      </Stack>
      {getInputGap()}
      <Stack width="50%">
        <Stack width="80px" justifyContent="center">
          다락방
        </Stack>
        {getLabelGap()}
        {retreatAttend?.user.kakaoId && (
          <TextField
            fullWidth={true}
            className="TextField"
            value={retreatAttend.user.community?.name}
            placeholder="전화번호를 입력하세요."
            disabled
          />
        )}
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
          className="Select"
          key={retreatAttend?.howToGo}
          defaultValue={retreatAttend?.howToGo}
          value={retreatAttend?.howToGo}
          onChange={(e) => {
            if (inOutData.length === 0) {
              setInOutData([])
            }
            changeInformation("howToGo", e.target.value.toString())
          }}
        >
          <MenuItem value={HowToMove.together}>교회 버스로</MenuItem>
          <MenuItem value={HowToMove.driveCarWithPerson}>
            자차 (카풀 가능, 이동 방법을 추가해주세요)
          </MenuItem>
          <MenuItem value={HowToMove.rideCar}>
            카풀 신청 (이동 방법을 추가해주세요)
          </MenuItem>
          <MenuItem value={HowToMove.goAlone}>대중교통 (여주역)</MenuItem>
          <MenuItem value={HowToMove.driveCarAlone}>자차 (카풀 불가)</MenuItem>
          <MenuItem value={HowToMove.etc}>기타 (하단에 메모)</MenuItem>
        </Select>
        <Stack ml="10px">
          <InOutFrom setInOutData={setInOutData} inOutData={inOutData} />
        </Stack>
      </Stack>
      {getInputGap()}
      <Stack>
        {getInputGap()}
        <Stack minWidth="100px" justifyContent="center">
          주일날 교회로 오는 방법
        </Stack>
        {getLabelGap()}
        <Select
          fullWidth={true}
          className="Select"
          key={retreatAttend?.howToBack}
          defaultValue={retreatAttend?.howToBack}
          value={retreatAttend?.howToBack}
          onChange={(e) =>
            changeInformation("howToBack", e.target.value.toString())
          }
        >
          <MenuItem value={HowToMove.together.toString()}>교회 버스로</MenuItem>
          <MenuItem value={HowToMove.etc.toString()}>
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
          className="TextField"
          key={retreatAttend?.user.kakaoId}
          value={retreatAttend?.user.etc}
          placeholder="기타사항이 있을 경우 입력하세요."
          onChange={(e) => changeInformation("etc", e.target.value)}
        />
      </Stack>
      {getInputGap()}

      <Stack marginTop="10px">
        <Button
          variant="contained"
          onClick={submit}
          style={{
            fontSize: "18px",
            backgroundColor: "white",
            color: "#1d321a",
          }}
        >
          신청 완료하기
        </Button>
      </Stack>
    </Stack>
  )
}
