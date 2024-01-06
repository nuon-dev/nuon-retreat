import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { Dispatch, SetStateAction, useEffect } from "react"
import { post } from "pages/api"
import { InOutInfo } from "@entity/inOutInfo"
import { Days, InOutType, MoveType } from "@entity/types"

interface IProps {
  setInOutData: Dispatch<SetStateAction<InOutInfo[]>>
  inOutData: Array<InOutInfo>
}

export default function InOutFrom({ inOutData, setInOutData }: IProps) {
  useEffect(() => {
    if (inOutData.length === 0) {
      onClickAdd()
    }
  })

  function onClickAdd() {
    const emptyInfo = new InOutInfo()
    emptyInfo.day = Days.firstDay
    emptyInfo.inOutType = InOutType.IN
    emptyInfo.position = "교회"
    emptyInfo.time = 9
    emptyInfo.howToMove = MoveType.driveCarWithPerson
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
        style={{
          border: "1px solid #AAA",
          borderRadius: "4px",
          padding: "4px",
        }}
      >
        <Stack>
          <Stack fontSize="12px" p="6px">
            들어오는 날짜 선택
          </Stack>
          <Select
            value={data.day}
            onChange={(e) =>
              onChangeInformation("day", e.target.value.toString(), index)
            }
          >
            <MenuItem value={Days.firstDay}>2(금)</MenuItem>
            <MenuItem value={Days.secondDay}>3(토)</MenuItem>
          </Select>
          {/*
            <Stack fontSize="12px" p="6px">
              이동방향
            </Stack>
            <Select
              value={data.inOutType}
              onChange={(e) =>
                onChangeInformation("inOutType", e.target.value.toString(), index)
              }
            >
              <MenuItem value={InOutType.IN}>수련회장 들어가기</MenuItem>
              <MenuItem value={InOutType.OUT}>수련회장에서 나오기</MenuItem>
            </Select>
          */}
          <Stack fontSize="12px" p="6px">
            수련회장 예상 도착 시간
          </Stack>
          <Select
            fullWidth={true}
            value={data.time}
            onChange={(e) =>
              onChangeInformation("time", e.target.value.toString(), index)
            }
          >
            <MenuItem value={9}>09시</MenuItem>
            <MenuItem value={13}>13시</MenuItem>
            <MenuItem value={15}>15시</MenuItem>
            <MenuItem value={20}>20시</MenuItem>
          </Select>
        </Stack>
        <Stack>
          <Stack fontSize="12px" p="6px">
            이동방법
          </Stack>
          <FormControl>
            <Select
              fullWidth={true}
              value={data.howToMove}
              onChange={(e) =>
                onChangeInformation(
                  "howToMove",
                  e.target.value.toString(),
                  index
                )
              }
            >
              <MenuItem value={MoveType.driveCarWithPerson}>
                자차 이동(카풀 가능)
              </MenuItem>
              <MenuItem value={MoveType.driveCarAlone}>
                자차 이동(카풀 불가)
              </MenuItem>
              <MenuItem value={MoveType.rideCar}>카풀 요청</MenuItem>
              <MenuItem value={MoveType.goAlone}>대중교통 (여주역)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {(data.howToMove == MoveType.driveCarWithPerson ||
          data.howToMove == MoveType.rideCar) && (
          <Stack>
            <Stack fontSize="12px" p="6px">
              장소
            </Stack>
            <Select
              value={data.position}
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
        {/*
          <Stack marginTop="10px">
            <Button variant="outlined" onClick={() => onClickRemove(index)}>
              이동 방법 삭제
            </Button>
          </Stack>
        */}
      </Stack>
    )
  }

  return (
    <Stack marginTop="10px">
      {/**
      <Button variant="contained" onClick={onClickAdd}>
        이동 방법 추가
      </Button>
         */}
      {inOutData.map((data, index) => getRow(data, index))}
    </Stack>
  )
}
