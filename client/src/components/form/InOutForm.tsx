import { Button, FormControl, MenuItem, Select, Stack } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { post } from "pages/api"
import { InOutInfo } from "@server/entity/inOutInfo"
import { Days, HowToMove, InOutType } from "@server/entity/types"

interface IProps {
  setInOutData: Dispatch<SetStateAction<InOutInfo[]>>
  inOutData: Array<InOutInfo>
}

export default function InOutFrom({ inOutData, setInOutData }: IProps) {
  function onClickAdd() {
    const emptyInfo = new InOutInfo()
    emptyInfo.day = Days.firstDay
    emptyInfo.inOutType = InOutType.IN
    emptyInfo.position = "교회"
    emptyInfo.time = ""
    emptyInfo.howToMove = HowToMove.driveCarWithPerson
    setInOutData([...inOutData, emptyInfo])
  }

  function onClickRemove(targetInfoIndex: number) {
    const deleteInfo = inOutData[targetInfoIndex]
    if (deleteInfo && deleteInfo.id) {
      post("/info/delete-attend-time", {
        inOutInfo: deleteInfo,
      })
    }
    inOutData.splice(targetInfoIndex, 1)
    setInOutData([...inOutData])
  }

  function onChangeInformation(type: string, data: string, index: number) {
    inOutData[index] = {
      ...inOutData[index],
      [type]: data,
    }
    setInOutData([...inOutData])
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
            <MenuItem value={Days.firstDay}>15(목)</MenuItem>
            <MenuItem value={Days.secondDay}>16(금)</MenuItem>
            <MenuItem value={Days.thirdDay}>17(토)</MenuItem>
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
            {data.day !== Days.firstDay && <MenuItem value={9}>09시</MenuItem>}
            <MenuItem value={13}>13시</MenuItem>
            <MenuItem value={20}>20시</MenuItem>
            {data.inOutType === InOutType.OUT && (
              <MenuItem value={24}>집회 후</MenuItem>
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
              <MenuItem value={"수원시청"}>수원시청</MenuItem>
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
    <Stack marginTop="10px">
      {
        <Button
          variant="contained"
          onClick={onClickAdd}
          style={{ backgroundColor: "#3d524a" }}
        >
          이동 방법 추가
        </Button>
      }
      {inOutData.map((data, index) => getRow(data, index))}
    </Stack>
  )
}
