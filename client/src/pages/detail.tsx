import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { get, post } from "./api"
import { useEffect, useState } from "react"
import { User } from "@entity/user"
import { InOutInfo } from "@entity/inOutInfo"
import styled from "@emotion/styled"
import { NotificationMessage } from "state/notification"
import { HowToGo } from "@entity/types"
import { useSetRecoilState } from "recoil"

export default function selectData() {
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
      }
    })
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
      /*
    } else if (!userInformation.howToGo) {
      setNotificationMessage("이동 방법을 선택해주세요.")
      return
      */
    } else if (!userInformation.howToLeave) {
      setNotificationMessage("이동 방법을 선택해주세요.")
      return
    }
    const url = "/auth/edit-user"

    const { result } = await post(url, userInformation)
    if (result === "success") {
      setNotificationMessage(`신청 내역이 저장이 되었습니다.`)
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
            width: "110%",
            left: "-5%",
            top: "-350px",
            filter: "blur(5px)",
          }}
          src="/main_bg.jpg"
        />
        <Stack color="white">000</Stack>
        <Stack zIndex="10" color="white" padding="12px" fontWeight="600">
          <span>내 귀에 들린 대로 행하리니 &lt; 민 14 : 28 &gt;</span>
          <span
            style={{ fontWeight: "600", color: "#aaa", lineHeight: "30px" }}
          >
            여주 중앙 청소년 수련원
          </span>
        </Stack>
      </Stack>
      <Stack bgcolor="white" zIndex="10" width="105%" p="12px">
        <Stack fontSize="14px" fontWeight="600" px="20px" py="4px">
          <span>입금 계좌와 금액을 확인 해주세요</span>
          <span>카카오뱅크: 3333200247760 (성은비)</span>
        </Stack>
        <Stack alignItems="center" width="100%">
          <Box width="95%" height="4px" bgcolor="black" borderRadius="2px" />
        </Stack>
        <Stack p="8px">
          <span style={{ color: "#ccc" }}>일반</span>
          <span
            style={{ fontSize: "24px", fontWeight: 600, lineHeight: "30px" }}
          >
            60,000원
          </span>
        </Stack>
        <Box width="95%" height="1px" bgcolor="black" />
        예매자 정보 입력
        {getInputGap()}
        <Stack>이름</Stack>
        {getLabelGap()}
        <TextField
          fullWidth={true}
          value={userInformation.name}
          placeholder="이름을 입력하세요."
          onChange={(e) => changeInformation("name", e.target.value)}
        />
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
            {userInformation && (
              <Select
                value={userInformation.sex}
                defaultValue={userInformation.sex}
                placeholder="성별을 선택하세요."
                onChange={(e) => changeInformation("sex", e.target.value)}
              >
                <MenuItem value={"man"}>남</MenuItem>
                <MenuItem value={"woman"}>여</MenuItem>
              </Select>
            )}
          </FormControl>
        </Stack>
        {getInputGap()}{" "}
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
    </Stack>
  )
}

const CalendalDate = styled.span`
  width: 40px;
  height: 35px;
  color: #c4c4c4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 24px;
`
