import { Button, FormControlLabel, FormLabel, Input, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { InOutInfo } from '@entity/inOutInfo' 
import { Days, InOutType, MoveType } from "../../types";
import { post } from "pages/api";

interface IProps {
    setInOutData: Dispatch<SetStateAction<InOutInfo[]>>,
    inOutData: Array<InOutInfo>,
}

export default function InOutFrom ({
    inOutData,
    setInOutData,
}: IProps) {
    
    function onClickAdd(){
        const emptyInfo = new InOutInfo() 
        emptyInfo.day = Days.firstDay
        emptyInfo.inOutType = InOutType.IN
        //emptyInfo.howToMove = MoveType.rideCar
        setInOutData([...inOutData, emptyInfo])
    }

    function onClickRemove(){
        const deleteInfo = inOutData.pop()
        if(deleteInfo && deleteInfo.id){
            post('/info/delete-attend-time', {
                inOutInfo: deleteInfo
            })
        }
        setInOutData([...inOutData])
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
        <Stack  marginTop="10px">
            <Stack direction="row">
                <Select
                    value={data.day}
                    onChange={e => onChangeInformation("day", e.target.value.toString(), index)}
                >
                    <MenuItem value={Days.firstDay}>
                        17(금)
                    </MenuItem>
                    <MenuItem value={Days.secondDay}>
                        18(토)
                    </MenuItem>
                    <MenuItem value={Days.thirdDay}>
                        19(일)
                    </MenuItem>
                </Select>
                <Select
                    value={data.inOutType}
                    onChange={e => onChangeInformation("inOutType", e.target.value.toString(), index)}
                >
                    <MenuItem value={InOutType.IN}>
                        In
                    </MenuItem>
                    <MenuItem value={InOutType.OUT}>
                        Out
                    </MenuItem>
                </Select>
                <TextField 
                    label="시간"
                    value={data.time}
                    onChange={e => onChangeInformation("time", e.target.value, index)}
                />
                <TextField
                    label="장소"
                    value={data.position}
                    onChange={e => onChangeInformation("position", e.target.value, index)}
                />

        </Stack>
          <Stack>
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
          </Stack>
        </Stack>)
    }

    return(<Stack
        marginTop="10px"
    >
        <Button
            variant="outlined"
            onClick={onClickAdd}
        >참가 일정 추가</Button>
        <Stack marginTop="10px">
            <Button
                variant="outlined"
                onClick={onClickRemove}
            >참가 일정 삭제</Button>
        </Stack>
        {inOutData.map((data, index) => getRow(data, index))}
    </Stack>)
}