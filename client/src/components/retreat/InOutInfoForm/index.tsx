import { Button, FormControl, MenuItem, Select, Stack } from "@mui/material"
import styles from "./index.module.css"
import { atom, useRecoilState, useSetRecoilState } from "recoil"
import useRetreatData from "hooks/useRetreatData"
import { InOutType, HowToMove, Days } from "@server/entity/types"
import { InOutInfo } from "@server/entity/inOutInfo"
import { post } from "pages/api"
import { useEffect } from "react"
import { StopRetreatBodyScrollAtom } from "pages/retreat"

export const ShowInOutInfoComponentAtom = atom<boolean>({
  key: "show-in-out-info",
  default: false,
})

export default function InOutInfoForm() {
  const [showInOutInfo, setShowInOutInfo] = useRecoilState(
    ShowInOutInfoComponentAtom
  )
  const { addInfo, inOutInfoList, setInOutData } = useRetreatData()
  const setStopRetreatBodyScroll = useSetRecoilState(StopRetreatBodyScrollAtom)

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
      post("/info/delete-attend-time", {
        inOutInfo: deleteInfo,
      })
    }
    inOutInfoList.splice(targetInfoIndex, 1)
    setInOutData([...inOutInfoList])
  }

  function onChangeInformation(type: string, data: string, index: number) {
    inOutInfoList[index] = {
      ...inOutInfoList[index],
      [type]: data,
    }
    setInOutData([...inOutInfoList])
  }

  function getRow(data: InOutInfo, index: number) {
    return (
      <Stack
        marginTop="10px"
        gap="12px"
        style={{
          border: "1px solid #AAA",
          borderRadius: "24px",
          padding: "12px",
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
            <MenuItem value={9}>09시</MenuItem>
            <MenuItem value={13}>13시</MenuItem>
            <MenuItem value={15}>15시</MenuItem>
            <MenuItem value={20}>20시</MenuItem>
            <MenuItem value={24}>집회 후</MenuItem>
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
              <MenuItem value={HowToMove.driveCarAlone}>
                자차 이동(카풀 불가)
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
              <MenuItem value={"여주역"}>여주역(수련회장)</MenuItem>
              <MenuItem value={"기타지역"}>기타지역</MenuItem>
            </Select>
          </Stack>
        )}
        {
          <Stack marginTop="10px">
            <Button
              variant="contained"
              onClick={() => onClickRemove(index)}
              style={{ backgroundColor: "#3d524a" }}
            >
              이동 방법 삭제
            </Button>
          </Stack>
        }
      </Stack>
    )
  }

  return (
    <Stack
      className={
        showInOutInfo ? styles["in-out-info-show"] : styles["in-out-info-hide"]
      }
      position="fixed"
      bgcolor="white"
      bottom="0px"
      width="95%"
      alignSelf="center"
      height="90vh"
      padding="20px"
      style={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
      }}
    >
      <Stack position="static" style={{ overflowY: "scroll" }}>
        <Stack>출입정보 관리 등록</Stack>

        <Button
          variant="contained"
          onClick={() => addInfo(InOutType.IN)}
          style={{ backgroundColor: "#3d524a" }}
        >
          이동 방법 추가
        </Button>
        {inOutInfoList.map((inOutInfo, index) => (
          <Stack key={index}>{getRow(inOutInfo, index)}</Stack>
        ))}
        <Button onClick={() => setShowInOutInfo(false)}>저장</Button>
      </Stack>
    </Stack>
  )
}
