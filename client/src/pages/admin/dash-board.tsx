import { Stack } from "@mui/material"
import { get } from "../../pages/api"
import { useEffect, useState } from "react"

function DashBoard() {
    const [getAttendeeStatus, setAttendeeStatus] = useState({} as Record<string, number>)
    const [getAttendanceTimeList, setAttendaceTimeList] = useState([])
    const [windowSize, setWindowSize] = useState({} as Record<string, number>)

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
        fetchData()
        setInterval(fetchData, 1000 * 60 * 30)
    }, [])

    async function fetchData(){
        setAttendeeStatus(await get('/admin/get-attendee-status'))
        setAttendaceTimeList(await get('/admin/get-attendance-time'))
    }


    function attendeeStatus() {
        return(
            <Stack>
                <Stack>참석자 현황</Stack>
                <Stack>전체 참석자 : {getAttendeeStatus.all}</Stack>
                <Stack>남/여 : {getAttendeeStatus.man} / {getAttendeeStatus.woman}</Stack>
                <Stack>전참/부참 : {getAttendeeStatus.fullAttend} / {getAttendeeStatus.halfAttend}</Stack>
                <Stack>버스로 이동/카풀 및 부참 : {getAttendeeStatus.goTogether} / {getAttendeeStatus.goCar}</Stack>
                <Stack>입금 처리/미완 : {getAttendeeStatus.completDeposit} / {getAttendeeStatus.all - getAttendeeStatus.completDeposit}</Stack>
            </Stack>
        )
    }

    function attendanceTime() {
        const format = (time: Date) => `${time.getMonth() + 1}.${time.getDate()}`

        const elementSize = {
            width: windowSize.width - 32,
            height: windowSize.height / 2 - 20
        }

        const GRAPH_SIZE = 14
        const toDay = new Date()
        const last30Days = new Array(GRAPH_SIZE).fill(0).map(_ => new Date())
        last30Days.forEach((day, index) => day.setDate(toDay.getDate() + (index - GRAPH_SIZE + 1)) )
        const xAxis = last30Days.map(day => format(day))

        const timeData: Record<string, number> = {}
        getAttendanceTimeList.forEach(time => {
            const date = format(new Date(time))
            if(timeData[date]){
                timeData[date] = timeData[date] + 1
            }else{
                timeData[date] = 1
            }
        })

        const WEIGHT = 1
        const STEP = 5

        return (<Stack>
            <Stack>일별 등록자 수</Stack>
            <svg height={elementSize.height}>
                <rect fillOpacity="0" width={elementSize.width} height={elementSize.height} stroke="black" strokeWidth="1"/>
                {xAxis.map((xValue, index) => <text x={elementSize.width / xAxis.length * index + STEP} y={elementSize.height - STEP} fontSize="12px">{xValue}</text>)}
                {xAxis.map((xValue, index) => <rect x={elementSize.width / xAxis.length * index + STEP + 5} y={elementSize.height - timeData[xValue] * WEIGHT - 20} width="10" height={timeData[xValue] * WEIGHT} />)}
                {xAxis.map((xValue, index) => <text x={elementSize.width / xAxis.length * index + 5} y={elementSize.height - timeData[xValue] * WEIGHT - 25} fontSize="12px">{timeData[xValue]}</text>)}
            </svg>
        </Stack>)
    }


    return (
        <Stack 
            width="100%" 
            height="100%"
            style={{
                margin: '12px'
            }}
        >
            <Stack direction="row" height="50%">
                <Stack>
                    {attendeeStatus()}
                </Stack>
            </Stack>
            <Stack mt="12px">
                {attendanceTime()}
            </Stack>
        </Stack>
    )
}

export default DashBoard