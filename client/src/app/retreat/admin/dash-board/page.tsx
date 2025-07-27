"use client"

import { Box, Grid, Typography } from "@mui/material"
import { get } from "../../../../config/api"
import { useEffect, useState } from "react"
import { InOutInfo } from "@server/entity/retreat/inOutInfo"
import Header from "@/components/retreat/admin/Header"
import StatCard from "@/app/retreat/admin/dash-board/StatCard"
import BarChart from "@/app/retreat/admin/dash-board/BarChart"
import AttendanceTimeline from "@/app/retreat/admin/dash-board/AttendanceTimeline"
import PeopleIcon from "@mui/icons-material/People"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import PaymentIcon from "@mui/icons-material/Payment"

function DashBoard() {
  const [attendeeStatus, setAttendeeStatus] = useState(
    {} as Record<string, number>
  )
  const [attendanceTimeList, setAttendanceTimeList] = useState([])
  const [ageInfoList, setAgeInfoList] = useState<Record<string, number>>({})
  const [infoList, setInfoList] = useState<InOutInfo[]>([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const [status, timeList, ageInfo, info] = await Promise.all([
        get("/retreat/admin/get-attendee-status"),
        get("/retreat/admin/get-attendance-time"),
        get("/retreat/admin/get-age-info"),
        get("/retreat/admin/in-out-info"),
      ])

      setAttendeeStatus(status)
      setAttendanceTimeList(timeList)
      setAgeInfoList(ageInfo)
      setInfoList(info)
    } catch (error) {
      console.error("데이터 조회 실패:", error)
    }
  }

  // 일별 등록자 데이터 처리 - 날짜순으로 정렬
  const getDailyRegistrationData = () => {
    const timeData: Record<string, number> = {}
    attendanceTimeList.forEach((time) => {
      const date = new Date(time)
      const key = `${date.getMonth() + 1}.${date.getDate()}`
      timeData[key] = (timeData[key] || 0) + 1
    })

    // 날짜순으로 정렬
    const sortedEntries = Object.entries(timeData).sort(([a], [b]) => {
      const [monthA, dayA] = a.split(".").map(Number)
      const [monthB, dayB] = b.split(".").map(Number)

      if (monthA !== monthB) {
        return monthA - monthB
      }
      return dayA - dayB
    })

    return Object.fromEntries(sortedEntries)
  }

  const targetCount = 400
  const attendanceRate = ((attendeeStatus.all / targetCount) * 100).toFixed(1)
  const maleRate = ((attendeeStatus.man / attendeeStatus.all) * 100).toFixed(1)
  const femaleRate = (
    (attendeeStatus.woman / attendeeStatus.all) *
    100
  ).toFixed(1)
  const depositRate = (
    (attendeeStatus.completeDeposit / attendeeStatus.all) *
    100
  ).toFixed(1)

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="text.primary">
          수련회 현황 대시보드
        </Typography>

        {/* 주요 통계 카드들 */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <StatCard
            title="총 참가자"
            value={`${attendeeStatus.all || 0}`}
            subtitle={`목표: ${targetCount}명`}
            icon={<PeopleIcon />}
            backgroundColor="#E3F2FD"
          />

          <StatCard
            title="참석률"
            value={`${attendanceRate}%`}
            icon={<TrendingUpIcon />}
            backgroundColor="#E8F5E8"
          />

          <StatCard
            title="성비"
            value={`${attendeeStatus.man || 0} : ${attendeeStatus.woman || 0}`}
            subtitle={`남 ${maleRate}% / 여 ${femaleRate}%`}
            icon={
              <Box sx={{ display: "flex" }}>
                <MaleIcon color="primary" />
                <FemaleIcon sx={{ color: "pink" }} />
              </Box>
            }
            backgroundColor="#FFF3E0"
          />

          <StatCard
            title="입금 완료율"
            value={`${depositRate}%`}
            icon={<PaymentIcon />}
            backgroundColor="#F3E5F5"
          />
        </Grid>

        {/* 버스 이용 현황 */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <StatCard
            title="주일 수련회장 버스"
            value={`${attendeeStatus.leaveTogether || 0}명`}
            icon={<DirectionsBusIcon />}
            backgroundColor="#E1F5FE"
          />

          <StatCard
            title="목요일 교회 버스"
            value={`${attendeeStatus.goTogether || 0}명`}
            icon={<DirectionsBusIcon />}
            backgroundColor="#E8EAF6"
          />

          <StatCard
            title="금요일 교회 버스"
            value={`${attendeeStatus.rideCar || 0}명`}
            icon={<DirectionsBusIcon />}
            backgroundColor="#FDE7E7"
          />
        </Grid>

        {/* 차트들 */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <BarChart
            title="일별 등록자 수"
            data={getDailyRegistrationData()}
            color="#3B82F6"
          />

          <BarChart
            title="나이별 등록자 수"
            data={Object.fromEntries(
              Object.entries(ageInfoList).map(([key, value]) => [
                key.slice(2, 4) + "년생",
                value,
              ])
            )}
            color="#10B981"
          />
        </Grid>

        {/* 시간별 참석자 현황 
        <AttendanceTimeline
          infoList={infoList}
          attendeeStatus={attendeeStatus}
        />
        */}
      </Box>
    </Box>
  )
}

export default DashBoard
