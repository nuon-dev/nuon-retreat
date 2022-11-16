import { InOutInfo } from "@server/src/entity/inOutInfo";
import { Days, MoveType , InOutType} from "../../types";
import { get, post } from "pages/api";
import { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { MenuItem, Select } from "@mui/material";


function Carpooling() {
    const [carpoolingInfo, setCarpoolingInfo] = useState([] )
    const [carList, setCarList] = useState([] as InOutInfo[])
    const [rideUserList, setRideUserList] = useState([] as InOutInfo[])
    const [selectedInfo, setSelectedInfo] = useState({} as InOutInfo)

    const [selectedDay, setSelectedDay] = useState(Days.firstDay)
    const [selectedInOut, setSelectedInOut] = useState(InOutType.IN)

    useEffect(() => {
        fetchData()
    }, [])

    async function setCar(car: InOutInfo){
        selectedInfo.rideCarInfo = car
        await post('/admin/set-car', {
            inOutInfo: selectedInfo
        })
        fetchData();
    }

    function fetchData(){
        get('/admin//get-car-info')
        .then((data: InOutInfo[]) => {
            const cars = data.filter(info => info.howToMove === MoveType.driveCarWithPerson)
            setCarList(cars)
            const rideUsers = data.filter(info => info.howToMove === MoveType.rideCar && !info.rideCarInfo)
            setRideUserList(rideUsers)
            const carpooing = data.filter(info => info.rideCarInfo)
            carpooing.forEach(each => carpoolingInfo[each.rideCarInfo.id])
        });
    }

    function getRowOfInfo(info: InOutInfo){
        return (<Stack
            onMouseDown={() => setSelectedInfo(info)}
        >
            {info.user?.name} ({info.time}시 {info.position})
        </Stack>)
    }

    return(<Stack direction="row">
        <Stack>
            <Select 
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
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
            value={selectedInOut}
            onChange={e => setSelectedInOut(e.target.value)}
            >
                <MenuItem value={InOutType.IN}>
                    들어가는 차
                </MenuItem>
                <MenuItem value={InOutType.OUT}>
                    나가는 차
                </MenuItem>
            </Select>
        </Stack>
        <Stack>
            <Stack>탐승 예정자</Stack>
            {rideUserList.filter(info => info.day === selectedDay && info.inOutType === selectedInOut).map(info => getRowOfInfo(info))}
        </Stack>
        <Stack direction="row">
            {carList.filter(info => info.day === selectedDay && info.inOutType === selectedInOut).map(car => 
            <Stack
            sx={{
                border: '1px solid black',
                borderRadius: '10px'
            }}
            onMouseUp={() => setCar(car)}
            >
                {car.user.name}의 차 ({car.time}시 / {car.position}))
                {car.userInTheCar.map(info => getRowOfInfo(info))}
            </Stack>)}
        </Stack>
    </Stack>)
}

export default Carpooling;