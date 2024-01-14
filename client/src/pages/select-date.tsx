import { Stack } from "@mui/material"
import { get, post } from "./api"
import { useEffect, useState } from "react"
import { User } from "@entity/user"
import { InOutInfo } from "@entity/inOutInfo"
import styled from "@emotion/styled"
import { Days, InOutType, MoveType } from "@entity/types"
import { useRouter } from "next/router"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function selectData() {
  const { push } = useRouter()
  const [userData, setUserData] = useState({} as User)
  const [selectedDate, setSelectedData] = useState(Days.firstDay)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      push("/")
      return
    }
    post("/auth/check-token", {
      token,
    })
      .then((response) => {
        if (response.result === "true") {
          setUserData(response.userData)
        }
      })
      .catch(() => {
        setNotificationMessage(
          "정보를 불러오는 과정에서 문제가 발생하였습니다."
        )
        push("/")
      })
  }

  async function onSelectDate(time: number) {
    userData.whenIn = `${selectedDate + 2} ${time}:00`
    const url = "/auth/edit-user"
    const { result } = await post(url, userData)
    push("/detail")
  }

  const selectList =
    selectedDate === Days.firstDay
      ? [
          {
            title: "오후 1 : 00",
            description: "교회 도착 (교회 버스 탑승 필수)",
            time: 13,
          },
          {
            title: "오후 2 : 30",
            description: "수련회장 도착 (자차)",
            time: 14,
          },
          {
            title: "오후 8 : 00",
            description: "수련회장 도착",
            time: 20,
          },
        ]
      : [
          {
            title: "오전 9 : 00",
            description: "수련회장 도착",
            time: 9,
          },
          {
            title: "오후 8 : 00",
            description: "수련회장 도착",
            time: 20,
          },
        ]

  return (
    <Stack>
      <Stack>
        <img
          style={{
            position: "absolute",
            width: "100%",
            top: "-300px",
            filter: "blur(5px)",
          }}
          src="/poster.webp"
        />
        <Stack color="white">000</Stack>
        <Stack zIndex="10" color="#333" padding="12px" fontWeight="600">
          <span>내 귀에 들린 대로 행하리니 [민 14 : 28]</span>
          <span
            style={{
              color: "#aaa",
              fontWeight: "600",
              lineHeight: "30px",
              fontSize: "14px",
            }}
          >
            여주 중앙 청소년 수련원
          </span>
        </Stack>
      </Stack>
      <Stack bgcolor="white" zIndex="10" width="100%">
        <Stack gap="12px" padding="12px">
          <span
            style={{ fontSize: "24px", textAlign: "center", color: "#333" }}
          >
            2024.02
          </span>
          <Stack direction="row" justifyContent="space-around">
            <span color="#ccc">일</span>
            <span color="#ccc">월</span>
            <span color="#ccc">화</span>
            <span color="#ccc">수</span>
            <span color="#ccc">목</span>
            <span color="#ccc">금</span>
            <span color="#ccc">토</span>
          </Stack>
          <Stack direction="row" justifyContent="space-around" mt="8px">
            <CalendalDate> </CalendalDate>
            <CalendalDate> </CalendalDate>
            <CalendalDate> </CalendalDate>
            <CalendalDate> </CalendalDate>
            <CalendalDate>1</CalendalDate>
            <CalendalDate
              style={{
                color: selectedDate === Days.firstDay ? "white" : "black",
                backgroundColor:
                  selectedDate === Days.firstDay ? "#5eaaef" : "",
              }}
              onClick={() => setSelectedData(Days.firstDay)}
            >
              2
            </CalendalDate>
            <CalendalDate
              style={{
                color: selectedDate === Days.secondDay ? "white" : "black",
                backgroundColor:
                  selectedDate === Days.secondDay ? "#5eaaef" : "",
              }}
              onClick={() => setSelectedData(Days.secondDay)}
            >
              3
            </CalendalDate>
          </Stack>
          <Stack direction="row" justifyContent="space-around">
            <CalendalDate>4</CalendalDate>
            <CalendalDate>5</CalendalDate>
            <CalendalDate>6</CalendalDate>
            <CalendalDate>7</CalendalDate>
            <CalendalDate>8</CalendalDate>
            <CalendalDate>9</CalendalDate>
            <CalendalDate>10</CalendalDate>
          </Stack>
          <Stack direction="row" justifyContent="space-around">
            <CalendalDate>11</CalendalDate>
            <CalendalDate>12</CalendalDate>
            <CalendalDate>13</CalendalDate>
            <CalendalDate>14</CalendalDate>
            <CalendalDate>15</CalendalDate>
            <CalendalDate>16</CalendalDate>
            <CalendalDate>17</CalendalDate>
          </Stack>
          <Stack direction="row" justifyContent="space-around">
            <CalendalDate>18</CalendalDate>
            <CalendalDate>19</CalendalDate>
            <CalendalDate>20</CalendalDate>
            <CalendalDate>21</CalendalDate>
            <CalendalDate>22</CalendalDate>
            <CalendalDate>23</CalendalDate>
            <CalendalDate>24</CalendalDate>
          </Stack>
          <Stack direction="row" justifyContent="space-around">
            <CalendalDate>25</CalendalDate>
            <CalendalDate>26</CalendalDate>
            <CalendalDate>27</CalendalDate>
            <CalendalDate>28</CalendalDate>
            <CalendalDate>29</CalendalDate>
            <CalendalDate></CalendalDate>
            <CalendalDate></CalendalDate>
          </Stack>
        </Stack>
        <Stack
          p="12px"
          pt="40px"
          color="#333"
          fontWeight="500"
          fontSize="16px"
          borderTop="1px solid #ccc"
        >
          입장 시간을 선택해주세요.
        </Stack>
        <Stack borderTop="solid 0.1px #ccc" mt="8px">
          {selectList.map((item) => (
            <Stack
              p="12px"
              direction="row"
              borderBottom="solid 0.1px #ccc"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <span
                  color="#ccc"
                  style={{ fontSize: "1.1rem", fontWeight: "400" }}
                >
                  {item.title}
                </span>
                <span
                  color="#ccc"
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                  }}
                >
                  {item.description}
                </span>
              </Stack>
              <Stack
                px="16px"
                mr="12px"
                height="30px"
                color="white"
                fontSize="16px"
                bgcolor="#5eaaef"
                borderRadius="24px"
                justifyContent="center"
                onClick={() => onSelectDate(item.time)}
              >
                선택 &gt;
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

const CalendalDate = styled.span`
  width: 35px;
  height: 35px;
  color: #c4c4c4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 35px;
`
