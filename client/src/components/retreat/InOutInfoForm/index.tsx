import { Button, FormControl, MenuItem, Select, Stack } from "@mui/material"
import styles from "./index.module.css"
import { atom, useRecoilState, useSetRecoilState } from "recoil"
import useRetreatData from "hooks/useRetreatData"
import { InOutType, HowToMove, Days } from "@server/entity/types"
import { InOutInfo } from "@server/entity/inOutInfo"
import { post } from "pages/api"
import { useEffect } from "react"
import {
  ShowInOutInfoComponentAtom,
  StopRetreatBodyScrollAtom,
} from "state/retreat"
import { NotificationMessage } from "state/notification"

export default function InOutInfoForm() {
  const [showInOutInfo, setShowInOutInfo] = useRecoilState(
    ShowInOutInfoComponentAtom
  )
  const { addInfo, inOutInfoList, setInOutData } = useRetreatData()
  const setStopRetreatBodyScroll = useSetRecoilState(StopRetreatBodyScrollAtom)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    if (showInOutInfo) {
      setStopRetreatBodyScroll(true)
    } else {
      setStopRetreatBodyScroll(false)
    }
  }, [showInOutInfo])

  function onClickRemove(targetInfoIndex: number) {
    const deleteInfo = inOutInfoList[targetInfoIndex]
    if (deleteInfo && deleteInfo.id) {
      post("/in-out-info/delete-attend-time", {
        inOutInfo: deleteInfo,
      })
    }
    const newInOutInfoList = [...inOutInfoList]
    newInOutInfoList.splice(targetInfoIndex, 1)
    setInOutData([...newInOutInfoList])
  }

  function onChangeInformation(type: string, data: string, index: number) {
    const newInOutInfoList = [...inOutInfoList]
    newInOutInfoList[index] = {
      ...newInOutInfoList[index],
      [type]: data,
    }
    setInOutData([...newInOutInfoList])
  }

  async function onSaveInOutInfoToServer() {
    function dayToString(day: Days) {
      if (day === Days.firstDay) {
        return "금요일"
      } else {
        return "토요일"
      }
    }

    for (const inOutInfo of inOutInfoList) {
      if (!inOutInfo.time) {
        setNotificationMessage(
          `${dayToString(inOutInfo.day)}에 출발 시간을 선택해주세요`
        )
        return
      }
      if (!inOutInfo.position) {
        setNotificationMessage(
          `${dayToString(inOutInfo.day)}에 출발 장소를 선택해주세요`
        )
        return
      }
    }
    const requestMap = inOutInfoList.map((inOutInfo) => {
      return post("/in-out-info/edit-information", inOutInfo)
    })
    await Promise.all(requestMap)
    setShowInOutInfo(false)
  }

  function getRow(data: InOutInfo, index: number) {
    return (
      <Stack
        marginTop="10px"
        gap="12px"
        width="calc(100vw - 30px)"
        style={{
          border: "1px solid #AAA",
          borderRadius: "8px",
          padding: "12px",
          scrollSnapAlign: "start",
        }}
      >
        <Stack>
          <Stack fontSize="12px" p="6px">
            날짜 선택
          </Stack>
          <Select
            value={data.day}
            className="Select"
            onChange={(e) =>
              onChangeInformation("day", e.target.value.toString(), index)
            }
          >
            <MenuItem value={Days.firstDay}>금요일</MenuItem>
            <MenuItem value={Days.secondDay}>토요일</MenuItem>
          </Select>
          <Stack fontSize="12px" p="6px">
            이동방향
          </Stack>
          <Select
            value={data.inOutType}
            className="Select"
            onChange={(e) =>
              onChangeInformation("inOutType", e.target.value.toString(), index)
            }
            disabled={data.autoCreated}
          >
            <MenuItem value={InOutType.IN}>수련회장 들어가기</MenuItem>
            <MenuItem value={InOutType.OUT}>수련회장에서 나오기</MenuItem>
          </Select>
          <Stack fontSize="12px" p="6px">
            예상 출발 시간
          </Stack>
          <Select
            fullWidth={true}
            className="Select"
            value={data.time}
            onChange={(e) =>
              onChangeInformation("time", e.target.value.toString(), index)
            }
          >
            {new Array((24 - 9) * 2).fill(0).map((_, i) => {
              const isOdd = i % 2 === 0
              const time = Math.floor(i / 2) + 9
              const timeNumber = time * 100 + (isOdd ? 30 : 0)
              return (
                <MenuItem value={timeNumber}>
                  {time}시 {isOdd ? "00" : "30"}분
                </MenuItem>
              )
            })}
            {data.inOutType === InOutType.OUT && (
              <MenuItem value={2400}>집회 후</MenuItem>
            )}
          </Select>
        </Stack>
        <Stack>
          <Stack fontSize="12px" p="6px">
            이동방법
          </Stack>
          <FormControl>
            <Select
              fullWidth={true}
              className="Select"
              value={data.howToMove}
              disabled={data.autoCreated}
              onChange={(e) =>
                onChangeInformation(
                  "howToMove",
                  e.target.value.toString(),
                  index
                )
              }
            >
              <MenuItem value={HowToMove.driveCarWithPerson}>
                자차 이동(카풀 가능)
              </MenuItem>
              <MenuItem value={HowToMove.rideCar}>카풀 요청</MenuItem>
              <MenuItem value={HowToMove.goAlone}>대중교통 (여주역)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {(data.howToMove == HowToMove.driveCarWithPerson ||
          data.howToMove == HowToMove.rideCar) && (
          <Stack>
            <Stack fontSize="12px" p="6px">
              장소
            </Stack>
            <Select
              value={data.position}
              className="Select"
              onChange={(e) =>
                onChangeInformation(
                  "position",
                  e.target.value.toString(),
                  index
                )
              }
            >
              <MenuItem value={"교회"}>교회</MenuItem>
              <MenuItem value={"아주대"}>아주대</MenuItem>
              <MenuItem value={"수원역"}>수원역</MenuItem>
              <MenuItem value={"광교"}>광교</MenuItem>
              <MenuItem value={"수원시청"}>수원시청</MenuItem>
              <MenuItem value={"여주역"}>여주역(수련회장)</MenuItem>
              <MenuItem value={"기타지역"}>기타지역</MenuItem>
            </Select>
          </Stack>
        )}
        {!data.autoCreated && (
          <Stack marginTop="10px">
            <Button
              variant="contained"
              onClick={() => onClickRemove(index)}
              style={{ backgroundColor: "#3d524a" }}
            >
              이동 방법 삭제
            </Button>
          </Stack>
        )}
      </Stack>
    )
  }

  return (
    <Stack
      position="fixed"
      bgcolor="white"
      bottom="0"
      width="100%"
      alignSelf="center"
      className={
        showInOutInfo
          ? styles["in-out-info-show-bg"]
          : styles["in-out-info-hide-bg"]
      }
      style={{
        pointerEvents: "none",
      }}
    >
      <Stack
        gap="12px"
        mt="5vh"
        border="1px solid #AAA"
        pt="20px"
        px="12px"
        height="95vh"
        className={
          showInOutInfo
            ? styles["in-out-info-show"]
            : styles["in-out-info-hide"]
        }
        style={{
          borderTopLeftRadius: "16px",
          backgroundColor: "rgba(255,255,255, 1)",
          borderTopRightRadius: "16px",
          pointerEvents: "auto",
        }}
        boxShadow="0px 0px 10px 0px #AAA"
      >
        <Stack borderRadius="24px" bgcolor="grey.200" p="12px" px="16px">
          # 출입정보 관리 등록
        </Stack>
        <Button
          variant="contained"
          onClick={() => addInfo(InOutType.IN, HowToMove.none)}
        >
          이동 방법 추가
        </Button>
        <Stack
          direction="row"
          gap="12px"
          position="static"
          style={{ overflow: "scroll" }}
          width="100%"
        >
          {inOutInfoList.map((inOutInfo, index) => (
            <Stack
              key={index}
              style={{
                scrollSnapType: "y mandatory",
              }}
            >
              {getRow(inOutInfo, index)}
            </Stack>
          ))}
        </Stack>
        <Button onClick={onSaveInOutInfoToServer}>저장</Button>
      </Stack>
    </Stack>
  )
}
