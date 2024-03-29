import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { post } from "./api"
import { useEffect, useState } from "react"
import { User } from "@entity/user"
import { NotificationMessage } from "state/notification"
import { HowToMove, MoveType } from "@entity/types"
import { useSetRecoilState } from "recoil"
import { useRouter } from "next/router"
import { CopyToClipboard } from "react-copy-to-clipboard"

export default function selectData() {
  const { push } = useRouter()
  const [userInformation, setUserInformation] = useState(new User())
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

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
        setUserInformation(response.userData)
      } else {
        setNotificationMessage("카카오 로그인 이후 이용 가능힙니다.")
        push("/")
      }
    })
  }
  const rideBus = "2 13:00"

  const submit = async () => {
    if (userInformation.whenIn === rideBus) {
      userInformation.howToGo = HowToMove.together
    }

    if (
      userInformation.whenIn !== rideBus &&
      userInformation.howToGo === HowToMove.together
    ) {
      setNotificationMessage("수련회 이동 방법을 선택해주세요.")
      return
    }

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
      setNotificationMessage("수련회 이동 방법을 선택해주세요.")
      return
    } else if (!userInformation.howToLeave) {
      setNotificationMessage("교회로 오는 방법을 선택해주세요.")
      return
    }
    const url = "/auth/edit-user"

    const { result } = await post(url, userInformation)
    if (result === "success") {
      setNotificationMessage(`신청 내역이 저장이 되었습니다.`)
      push("/reservation-confirm")
      return
    }
    setNotificationMessage("접수중 오류가 발생하였습니다.\n다시 시도해주세요.")
  }

  function getInputGap() {
    return <Stack margin="6px" />
  }

  function getLabelGap() {
    return <Stack margin="2px" />
  }

  const changeInformation = (type: string, data: string) => {
    setUserInformation({ ...userInformation, [type]: data })
  }

  return (
    <Stack>
      <Stack>
        <img
          style={{
            position: "absolute",
            top: "-300px",
            width: "100%",
            filter: "blur(5px)",
          }}
          src="/poster.webp"
        />
        <Stack color="white">000</Stack>
        <Stack zIndex="10" color="#333" padding="12px" fontWeight="600">
          <span>내 귀에 들린 대로 행하리니 [민 14 : 28]</span>
          <span
            style={{ fontWeight: "600", color: "#aaa", lineHeight: "30px" }}
          >
            여주 중앙 청소년 수련원
          </span>
        </Stack>
      </Stack>
      <Stack bgcolor="white" zIndex="10" width="100%" p="12px">
        <Stack fontSize="14px" fontWeight="600" px="24px" pt="4px" pb="12px">
          <span>입금 계좌와 금액을 확인 해주세요</span>
          <CopyToClipboard
            text="3333200247760 카카오뱅크"
            onCopy={() => {
              setNotificationMessage("계좌 번호가 복사 되었습니다.")
            }}
          >
            <span>카카오뱅크 : 3333200247760 (성은비)</span>
          </CopyToClipboard>
        </Stack>
        <Stack alignItems="center" width="100%">
          <Box width="95%" height="4px" bgcolor="black" borderRadius="2px" />
        </Stack>
        <Stack p="8px">
          <span style={{ color: "#aaa" }}>일반</span>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <span
              style={{ fontSize: "24px", fontWeight: 600, lineHeight: "30px" }}
            >
              60,000원
            </span>
            <Select value={1} style={{ height: "40px" }}>
              <MenuItem selected value={1}>
                1
              </MenuItem>
            </Select>
          </Stack>
        </Stack>
        <Box width="95%" height="1px" bgcolor="black" />
        {getInputGap()}
        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          예매자 정보 입력
        </span>
        {getInputGap()}
        {getInputGap()}
        <TextField
          label="이름"
          fullWidth={true}
          value={userInformation.name || ""}
          placeholder="이름을 입력하세요."
          onChange={(e) => changeInformation("name", e.target.value)}
        />
        {getInputGap()}
        <TextField
          label="전화번호"
          fullWidth={true}
          value={userInformation.phone || ""}
          placeholder="전화번호를 입력하세요."
          onChange={(e) => changeInformation("phone", e.target.value)}
        />
        {getInputGap()}
        <FormControl>
          <InputLabel>출생년도 (빠른은 친구 기준)</InputLabel>
          <Select
            label="출생년도 (빠른은 친구 기준)"
            fullWidth={true}
            value={userInformation.age || ""}
            placeholder="출생년도 (빠른은 친구 기준)"
            renderValue={(selected) => {
              console.log(selected)
              if (!selected) {
                return <em>Placeholder</em>
              }

              return selected
            }}
            onChange={(e) =>
              changeInformation("age", e.target.value.toString())
            }
          >
            <MenuItem disabled value={0}>
              <em>빠른은 친구 기준</em>
            </MenuItem>
            {new Array(45).fill(0).map((_, index) => {
              const year = new Date().getFullYear() - index - 19
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        {getInputGap()}
        <FormControl fullWidth={true}>
          <InputLabel>성별</InputLabel>
          {
            <Select
              label="성별"
              value={userInformation.sex || ""}
              placeholder="성별을 선택하세요."
              onChange={(e) => changeInformation("sex", e.target.value)}
            >
              <MenuItem value={"man"}>남</MenuItem>
              <MenuItem value={"woman"}>여</MenuItem>
            </Select>
          }
        </FormControl>
        {getInputGap()}
        <Stack>
          <FormControl fullWidth={true}>
            <InputLabel>참석 방법</InputLabel>
            <Select
              label="참석 방법"
              fullWidth={true}
              key={userInformation.howToGo}
              defaultValue={userInformation.howToGo}
              value={
                userInformation.whenIn === rideBus
                  ? MoveType.together
                  : userInformation.howToGo
              }
              disabled={userInformation.whenIn === rideBus}
              onChange={(e) =>
                changeInformation("howToGo", e.target.value.toString())
              }
            >
              {userInformation.whenIn === rideBus && (
                <MenuItem value={HowToMove.together}>교회 버스로</MenuItem>
              )}
              <MenuItem value={HowToMove.driveCarWithPerson}>
                자차 (카풀 가능)
              </MenuItem>
              <MenuItem value={HowToMove.rideCar}>
                카풀 신청 (시간, 장소 기타사항에)
              </MenuItem>
              <MenuItem value={HowToMove.goAlone}>대중교통 (여주역)</MenuItem>
              <MenuItem value={HowToMove.driveCarAlone}>
                자차 (카풀 불가)
              </MenuItem>
              <MenuItem value={HowToMove.etc}>기타 (하단에 메모)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack>
          {getInputGap()}
          <Stack minWidth="100px" justifyContent="center">
            주일 점심 교회로 오는 차
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
            <MenuItem value={HowToMove.together.toString()}>
              교회 버스로
            </MenuItem>
            <MenuItem value={HowToMove.etc.toString()}>
              기타 (자차 및 카풀)
            </MenuItem>
          </Select>
        </Stack>
        {getInputGap()}
        <TextField
          fullWidth={true}
          value={userInformation.etc || ""}
          placeholder="기타사항이 있을 경우 입력하세요."
          onChange={(e) => changeInformation("etc", e.target.value)}
        />
        {getInputGap()}
        <Stack marginTop="10px">
          <Button
            variant="contained"
            onClick={submit}
            style={{
              backgroundColor: "#5eaaef",
              borderRadius: "24px",
            }}
          >
            저장
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
