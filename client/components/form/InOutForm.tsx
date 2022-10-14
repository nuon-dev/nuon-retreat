import { Button, Input, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface IProps {
    onSetValue: Dispatch<SetStateAction<never[]>>,
    dataList: Array<any>,
}

export default function InOutFrom (props: IProps) {
    
    const [inOutData, setInOutData] = useState([{time: '10시', inOutType: 'in'}])

    function getRow (data) {
        return (<Stack>
            <Input value={data.time}/>
            <Stack>
                <Button>
                    In
                </Button>
                <Button>
                    Out
                </Button>
            </Stack>
        </Stack>)
    }

    return(<Stack>
        {inOutData.map(data => getRow(data))}
    </Stack>)
}