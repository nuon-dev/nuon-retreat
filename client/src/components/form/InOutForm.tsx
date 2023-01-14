import { Button, FormControlLabel, FormLabel, Input, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { InOutInfo } from '@entity/inOutInfo' 
import { AttendType, Days, InOutType, MoveType } from "types";

interface IProps {
    setInOutData: Dispatch<SetStateAction<InOutInfo[]>>,
    inOutData: Array<InOutInfo>,
}

export default function InOutFrom ({
    inOutData,
    setInOutData,
}: IProps) {
    
    function onClickAdd(){
        setInOutData([...inOutData, {
            day: Days.firstDay,
            inOutType: InOutType.IN,
            howToMove: MoveType.rideCar,
        } as InOutInfo])
    }

    function onChangeInformation(type: string, data: string, index: number){
        inOutData[index] = {
            ...inOutData[index],
            [type]: data
        }
        setInOutData([...inOutData])
    }

    function getRow (data: InOutInfo, index: number) {
        return (
        <Stack direction="row">
            <Select
            value={data.day}
            onChange={e => onChangeInformation("day", e.target.value.toString(), index)}
            >
            <MenuItem value={Days.firstDay}>
                첫째날
            </MenuItem>
            <MenuItem value={Days.secondDay}>
                둘째날
            </MenuItem>
            <MenuItem value={Days.thirdDay}>
                셋째날
            </MenuItem>
            </Select>
            <Select
                value={data.inOutType}
                onChange={e => onChangeInformation("inOutType", e.target.value.toString(), index)}
            >
                <MenuItem value={InOutType.IN}>
                    들어가기
                </MenuItem>
                <MenuItem value={InOutType.OUT}>
                    나오기
                </MenuItem>
            </Select>
        <TextField 
            value={data.time}
            onChange={e => onChangeInformation("time", e.target.value, index)}
        />에
        <TextField
            value={data.position}
            onChange={e => onChangeInformation("position", e.target.value, index)}
        />에서

        <Select
            value={data.howToMove}
            onChange={e => onChangeInformation("howToMove", e.target.value.toString(), index)}
        >
            <MenuItem value={MoveType.driveCarWithPerson}>
                자차 이동(카풀 가능)
            </MenuItem>
            <MenuItem value={MoveType.driveCarAlone}>
                자차 이동(카풀 불가)
            </MenuItem>
            <MenuItem value={MoveType.rideCar}>
                카풀 이동
            </MenuItem>
            <MenuItem value={MoveType.goAlone}>
                대중교통
            </MenuItem>
          </Select>
        </Stack>)
    }

    return(<Stack>
        <Button
            onClick={onClickAdd}
        >이동 방법 추가하기</Button>
        {inOutData.map((data, index) => getRow(data, index))}
    </Stack>)
}