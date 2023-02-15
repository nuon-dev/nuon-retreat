import { InOutInfo } from "@entity/inOutInfo";
import { Days, MoveType , InOutType} from "../../types";
import { get, post } from "../../pages/api";
import { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { MenuItem, Select } from "@mui/material";
import { User } from "@entity/user";


function Carpooling() {
    const [carList, setCarList] = useState([] as InOutInfo[])
    const [rideUserList, setRideUserList] = useState([] as InOutInfo[])
    const [selectedInfo, setSelectedInfo] = useState({} as InOutInfo)

    const [selectedDay, setSelectedDay] = useState<Number>(Days.firstDay)
    const [selectedInOut, setSelectedInOut] = useState<string>(InOutType.IN)
    const [mousePoint, setMousePoint] = useState([0,0])
    const [isShowUserInfo, setIsShowUserInfo] = useState(false)
    const [showUserInfo, setShowUserInfo] = useState({} as User)

    function onMouseMove(event: MouseEvent) {
        setMousePoint([event.pageX, event.pageY])
    }


    useEffect(() => {
        fetchData()
        addEventListener('mousemove', onMouseMove);

        return () => {
            removeEventListener('mousemove', onMouseMove)
        }
    }, [])

    function modal(){
        if(!isShowUserInfo){
            return <Stack/>
        }
        return(
        <Stack
            style={{
                position: 'absolute',
                top: mousePoint[1] + 10,
                left: mousePoint[0] + 10,
                border: '1px solid black',
                borderRadius: '12px',
                padding: '4px',
                backgroundColor: 'white',
            }}
        >
            {showUserInfo.name}의 정보<br/>
            기타 : {showUserInfo.etc} <br/>
            ({showUserInfo.phone})
        </Stack>)
    }

    async function setCar(car: InOutInfo){
        console.log(car)
        selectedInfo.rideCarInfo = car
        await post('/admin/set-car', {
            inOutInfo: selectedInfo
        })
        fetchData();
    }

    async function setEmptyCar(){
        selectedInfo.rideCarInfo = null
        await post('/admin/set-car', {
            inOutInfo: selectedInfo
        })
        fetchData();
    }

    function fetchData(){
        get('/admin/get-car-info')
        .then((data: InOutInfo[]) => {
            // @ts-ignore
            const cars = data.filter(info => info.howToMove === MoveType.driveCarWithPerson)
            setCarList(cars)
            // @ts-ignore
            const rideUsers = data.filter(info => info.howToMove === MoveType.rideCar && !info.rideCarInfo)
            setRideUserList(rideUsers)
        });
    }

    function setModal(user: User){
        setIsShowUserInfo(true)
        setShowUserInfo(user)
    }

    function getRowOfInfo(info: InOutInfo){
        return (<Stack
                onMouseEnter={() => {
                    setModal(info.user)
                }}
                onMouseLeave={() => {
                    setIsShowUserInfo(false)
                }}
                onMouseDown={() => setSelectedInfo(info)
            }
        >
            {info.user?.name} ({info.time}시 {info.position})
        </Stack>)
    }

    return(<Stack direction="row">
        <Stack>
            <Select 
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value as number)}
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
            onChange={e => setSelectedInOut(e.target.value as string)}
            >
                <MenuItem value={InOutType.IN}>
                    들어가는 차
                </MenuItem>
                <MenuItem value={InOutType.OUT}>
                    나가는 차
                </MenuItem>
            </Select>
        </Stack>
        {modal()}
        <Stack
            style={{
                border: '1px solid black',
                borderRadius: '10px',
                minWidth: '240px'
            }}
            onMouseUp={setEmptyCar}
        >
            <Stack>탐승 예정자</Stack>
            {rideUserList.filter(info => info.day === selectedDay && info.inOutType === selectedInOut).map(info => getRowOfInfo(info))}
        </Stack>
        <Stack 
            style={{
                overflow: 'auto',
                paddingRight: '70vw',
                border: '1px solid black',
                margin: '4px',
                width: 'calc(100% - 200px)'
            }} 
            direction="row"
        >
            {carList.filter(info => info.day === selectedDay && info.inOutType === selectedInOut).map(car => 
            <Stack
            sx={{
                border: '1px solid black',
                borderRadius: '10px',
                minWidth: '240px'
            }}
            onMouseUp={() => setCar(car)}
            >
                <Stack
                    onMouseEnter={() => {
                        setModal(car.user)
                    }}
                    onMouseLeave={() => {
                        setIsShowUserInfo(false)
                    }}
                >
                    {car.user.name}의 차 ({car.time}시 / {car.position}))
                </Stack>
                {car.userInTheCar.map(info => getRowOfInfo(info))}
            </Stack>)}
        </Stack>
    </Stack>)
}

export default Carpooling;