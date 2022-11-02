import { Button, Input, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { InOutInfo } from '@entity/inOutInfo' 

interface IProps {
    setInOutData: Dispatch<SetStateAction<InOutInfo[]>>,
    inOutData: Array<InOutInfo>,
}

export default function InOutFrom ({
    inOutData,
    setInOutData,
}: IProps) {
    
    
    function onClickAdd(){
        setInOutData([...inOutData, {} as InOutInfo])
    }

    function onChangeInformation(type: string, data: string, index: number){
        const temp = inOutData
        temp[index] = {
            ...temp[index],
            [type]: data
        }
        setInOutData(temp)
        console.log(temp)
            
    }

    function getRow (data: InOutInfo, index: number) {
        return (<Stack direction="row">{data.time}
            <TextField 
                value={data.time}
                onChange={e => onChangeInformation("time", e.target.value, index)}
            />
            <Stack direction="row">
                <Button
                    onClick={e => onChangeInformation("inOutType", "In", index)}
                >
                    In
                </Button>
                <Button
                    onClick={e => onChangeInformation("inOutType", "Out", index)}
                >
                    Out
                </Button>
            </Stack>
            <TextField
                value={data.position}
                onChange={e => onChangeInformation("position", e.target.value, index)}
            />
        </Stack>)
    }

    return(<Stack>
        <Button
            onClick={onClickAdd}
        >add</Button>
        {inOutData.map((data, index) => getRow(data, index))}
    </Stack>)
}